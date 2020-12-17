package pl.pjpsoft.engine

import org.jetbrains.exposed.sql.Column
import org.jetbrains.exposed.sql.Op
import org.jetbrains.exposed.sql.SortOrder

enum class ComparationOperator {
    LESS, GREATER
}

enum class Reverse {
    STRIGHT, REVERSE
}

enum class Direction {
    UP, DOWN
}


data class QueryParameters(val direction:Direction, val count: Int, val column: String, val value: String, val sortOrder: SortOrder);

data class SelectParameters(
    val condition: Op<Boolean>,
    val column: Column<out Comparable<Any>>,
    val sortOrder: SortOrder,
    val limit: Int,
    val stright: Reverse
);

fun querySetup(params: QueryParameters, column: Column<out Comparable<Any>>): SelectParameters {

    val sortOrder: SortOrder;
    val direction: Reverse;
    val comparationOperator: ComparationOperator;
    val limit = params.count;

    val queryParam = if (((params.direction == Direction.DOWN) && (params.sortOrder == SortOrder.ASC))
        || ((params.direction == Direction.UP) && (params.sortOrder == SortOrder.DESC))
    ) {
        sortOrder = SortOrder.ASC; direction = Reverse.STRIGHT; comparationOperator = ComparationOperator.GREATER;
    } else {
        sortOrder = SortOrder.DESC; direction = Reverse.REVERSE; comparationOperator = ComparationOperator.LESS;
    }

    val condition = if (comparationOperator == ComparationOperator.GREATER) {
        Op.build { column greater params.value }
    } else {
        Op.build { column less params.value }
    }

    return SelectParameters(condition, column, sortOrder, limit, direction);
}
