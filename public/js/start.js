var headerDefinition = {
    "formClassName":"w3-card",
    "headerClass":"w3-theme",
    "headerCells": [
        {
            "cellClass": "w3-right-align w3-border",
            "label": "id",
            "inputType":"hidden"
        },
        {
            "cellClass": "w3-center  w3-border",
            "label": "First name",
            "inputType":"text"
        },
        {
            "cellClass": "w3-center w3-border",
            "label": "Last name",
            "inputType":"text"
        }
    ]
}

var rowDefinition = {
    "rowClassName": "",
    "fields": [
        {
            "fieldClass": "w3-right-align  w3-border",
            "name": "id"
        },
        {
            "fieldClass": "w3-center  w3-border",
            "name": "fname"
        },
        {
            "fieldClass": "w3-center  w3-border",
            "name": "lname"
        }
    ]
}

function start(container, rowcount, dataSourceConfig) {

    this.dataSourceConfig = dataSourceConfig
    var grid = new DataGrid(container, "w3-table-all w3-hoverable", "dataGrid", headerDefinition, rowDefinition, 10);
    let dataSource = new DataSource(dataSourceConfig, grid);

}