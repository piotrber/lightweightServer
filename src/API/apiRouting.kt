package pl.pjpsoft.API

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.jetbrains.exposed.sql.SortOrder
import pl.pjpsoft.data.*
import pl.pjpsoft.model.Person
import pl.pjpsoft.utils.ifNull

fun Routing.routingApi() {
    getPersonData()
    getAllPersonData()
    savePersonData()
}


fun Routing.getPersonData() {

    get("/singlePerson") {

        val personId = call.request.queryParameters["id"]?.toInt()
        if (personId != null) {
            val person = getSinglePerson(personId)
            call.respond(
                mapOf("person" to person)
            )

        }
    }
}

fun Routing.getAllPersonData() {

    get("/all") {

        val personList = personDataList()

        call.respond(
            mapOf("personList" to personList)
        )
    }
}


fun Routing.getPagePersonData() {

    get("/page") {

        val selectParameters = SelectParameters(
            call.request.queryParameters["count"].ifNull("0").toInt(),
            call.request.queryParameters["column"].ifNull( ""),
            call.request.queryParameters["value"].ifNull(""),
            call.request.queryParameters["sortorder"].ifNull("0").toInt() as SortOrder,
        )

        val personList = personDataPage(selectParameters);

        call.respond(
            mapOf("personList" to personList)
        )
    }
}

fun Routing.savePersonData() {

    post("/updatePerson") {
        val person = withContext(Dispatchers.IO) {
            call.receive<Person>()
        }
        updatePerson(person)
        call.respond(HttpStatusCode.OK)
    }
}
