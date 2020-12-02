package pl.pjpsoft.html

import io.ktor.application.*
import io.ktor.response.*
import io.ktor.routing.*
import java.io.File

fun Routing.start() {

    get("/") {
        call.respondFile(File("index.html"))
    }
}