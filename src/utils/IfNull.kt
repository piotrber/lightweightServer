package pl.pjpsoft.utils

class IfNull<T>(private val value: T?, val subst: T) {

    fun getValue(): T {
        return if (value == null) {
            subst
        } else {
            value
        }
    }

}

fun String?.ifNull(subst: String): String {

    return if ( this== null) {
        subst
    } else {
        this
    }

}
