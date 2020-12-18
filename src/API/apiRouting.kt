package pl.pjpsoft.API

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.routing.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import pl.pjpsoft.data.*
import pl.pjpsoft.engine.QueryParameters
import pl.pjpsoft.model.Person

fun Routing.routingApi() {
    getPersonData()
    getAllPersonData()
    savePersonData()
    getPagePersonData()
    insertPersonData()
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

    post("/page") {

        val queryParameters = withContext(Dispatchers.IO) {
            call.receive<QueryParameters>()
        }

        val personList = personDataPage(queryParameters);

        if (personList.isEmpty()) {

            call.respond(HttpStatusCodeContent(HttpStatusCode.NoContent))

        } else {

            call.respond(
                mapOf("personList" to personList)
            )
        }
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



fun Routing.insertPersonData() {

    post("/insertPerson") {
        val person = withContext(Dispatchers.IO) {
            call.receive<Person>()
        }
        insertPerson(person)
        call.respond(
            mapOf("person" to person))
    }
}
