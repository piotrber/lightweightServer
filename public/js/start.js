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
    "rowClassName": "w3-center",
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

function start(container, colCount, rowcount, dataSourceConfig) {

    var grid = new DataGrid(container, "w3-table w3-striped", "dataGrid", headerDefinition, rowDefinition, 7);
    let dataSource = new DataSource(dataSourceConfig,grid);


}