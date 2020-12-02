var headerDefinition = {
    "headerCells": [
        {
            "cellClass": "w3-right-align",
            "label": "id"
        },
        {
            "cellClass": "w3-center",
            "label": "First name"
        },
        {
            "cellClass": "w3-center",
            "label": "Last name"
        }
    ]
}
var rowDefinition = {
    "fields": [
        {
            "fieldClass": "w3-right-align",
            "name": "id"
        },
        {
            "fieldClass": "w3-center",
            "name": "fname"
        },
        {
            "fieldClass": "w3-center",
            "name": "lname"
        }
    ]
}

// mock data

var tableData = {
    "personList": [
        {
            "id": 14,
            "fname": "Jan ",
            "lname": "Kowalski"
        },
        {
            "id": 15,
            "fname": "Joe",
            "lname": "Biden"
        },
        {
            "id": 16,
            "fname": "Czesław",
            "lname": "Niemen"
        },
        {
            "id": 17,
            "fname": "Anna",
            "lname": "German"
        }
    ]
}



function getRowData(i) {
    return tableData.personList[i];
}

function start(container, colCount, rowcount, getRowData) {

    let table = dataGrid(container, "w3-table w3-striped", "dataGrid", headerDefinition, rowDefinition, "w3-center", 4, getRowData);
}