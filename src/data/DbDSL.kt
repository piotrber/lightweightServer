package pl.pjpsoft.data

/*  using DSL variant */

import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import pl.pjpsoft.model.Person
import pl.pjpsoft.model.PersonList

object DbConnection {

    val db by lazy {
        Database.connect("jdbc:sqlite:file:data/data.db", "org.sqlite.JDBC")
    }

}

val db = DbConnection.db

data class SelectParameters(val count: Int, val column: String, val value: String, val sortOrder: SortOrder);

data class QueryData(val column: Column<out Comparable<Any>>, val condition: Op<Boolean>)

object PersonData : IntIdTable() {
    val fname = varchar("fname", 50)
    val lname = varchar("lname", 50)
}

fun PersonData.whereBuilder(params: SelectParameters): QueryData {

    val column = when (params.column) {
        "lname" -> PersonData.lname
        "fname" -> PersonData.fname
        else -> PersonData.id
    }

    val condition = arrayOf(
        Op.build { column greater params.value },
        Op.build { column less params.value }
    );

    val where = when {
        params.count > 0 && params.sortOrder == SortOrder.ASC -> condition[0]
        params.count < 0 && params.sortOrder == SortOrder.ASC -> condition[1]
        params.count > 0 && params.sortOrder == SortOrder.DESC -> condition[0]
        else -> condition[1]
    }
return QueryData(column as Column<out Comparable<Any>>,where)
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

fun personDataPage(param: SelectParameters): List<Person> {

    val personList = mutableListOf<Person>()
    val queryData = PersonData.whereBuilder(param)
    val column = queryData.column
    val condition = queryData.condition

    transaction {

        val personData =
            PersonData.selectAll().andWhere { condition }.orderBy(column, param.sortOrder).limit(param.count).toList()
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
