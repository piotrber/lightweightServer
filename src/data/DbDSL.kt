package pl.pjpsoft.data

/*  using DSL variant */

import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import pl.pjpsoft.engine.QueryParameters
import pl.pjpsoft.engine.Reverse
import pl.pjpsoft.engine.SelectParameters
import pl.pjpsoft.engine.querySetup
import pl.pjpsoft.model.Person
import pl.pjpsoft.model.PersonList

object DbConnection {

    val db by lazy {
        Database.connect("jdbc:sqlite:file:data/data.db", "org.sqlite.JDBC")
    }

}

val db = DbConnection.db

object PersonData : IntIdTable() {

    val fname = varchar("fname", 50)
    val lname = varchar("lname", 50)
}

fun PersonData.paramsBuilder(params: QueryParameters): SelectParameters {

    val column = when (params.column) {
        "lname" -> PersonData.lname
        "fname" -> PersonData.fname
        else -> PersonData.id
    }

    return querySetup(params, column as Column<out Comparable<Any>>);
}

fun PersonData.mapResultRowToPerson(it: ResultRow): Person =
    Person(id = it[PersonData.id].value, fname = it[PersonData.fname], lname = it[PersonData.lname])

fun getSinglePerson(personId: Int): Person {

    lateinit var person: Person

    transaction {
        person = PersonData.mapResultRowToPerson(PersonData.select { (PersonData.id eq personId) }.first())
    }
    return person
}

fun updatePerson(person: Person) {

    transaction {

        PersonData.update({ PersonData.id eq person.id }) {
            it[fname] = person.fname
            it[lname] = person.lname
        }
    }

}

fun insertNewPerson(person: Person) {

    transaction {

        val lastId = PersonData.insert {

            it[fname] = person.fname
            it[lname] = person.lname

        } get PersonData.id

    }

}

fun deletePerson(personId: Int) {

    transaction {
        PersonData.deleteWhere { PersonData.id eq personId }
    }

}

fun getPersonList(): PersonList {

    val personList = personDataList()
    return PersonList(personList)

}

fun personDataList(): List<Person> {

    val personList = mutableListOf<Person>()
    transaction {

        val personData = PersonData.selectAll().toList()
        personData.forEach {
            val person = PersonData.mapResultRowToPerson(it)
            personList.add(person)
        }
    }
    return personList
}

fun personDataPage(param: QueryParameters): List<Person> {

    val personList = mutableListOf<Person>()
    val selectParams = PersonData.paramsBuilder(param)
    var reverse = selectParams.stright == Reverse.REVERSE;

    transaction {

        var personData =
            PersonData.selectAll().andWhere { selectParams.condition }
                .orderBy(selectParams.column, selectParams.sortOrder).limit(selectParams.limit)
                .toList()
        if (reverse) {
            personData = personData.asReversed()
        }
        personData.forEach {
            val person = PersonData.mapResultRowToPerson(it)
            personList.add(person)
        }
    }

    return personList
}

fun execRawSql(sql: String) {

    transaction {
        exec(sql)
    }
}
