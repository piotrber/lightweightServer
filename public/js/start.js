var headerData = {
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
var rowData = {
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

function start(element, colCount, rowcount, tableData) {

    this.tableData = tableData;

    function getData(i, name) {
        return this.tableData.personList[i][name];
    }

    let container = document.getElementById("table");

    let table = dataGrid(container, "w3-table w3-striped", "dataGrid", headerData, "w3-center", rowData, "w3-center", 4, getData);

}