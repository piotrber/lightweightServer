var headerDefinition = {
    "headerClass": "w3-theme",
    "maxHeight":"360px",
    "headerCells": [
        {
            "cellClass": "w3-right-align w3-border",
            "label": "id",
            "inputType": "hidden",
            "inputClass":"w3-input",
            "fieldName":"id"

        },
        {
            "cellClass": "w3-center  w3-border",
            "label": "First name",
            "inputType": "text",
            "inputClass":"w3-input w3-margin",
            "fieldName":"fname"
        },
        {
            "cellClass": "w3-center w3-border",
            "label": "Last name",
            "inputType": "text",
            "inputClass":"w3-input w3-margin",
            "fieldName":"lname"

        }
    ],
    "formClassName": "w3-container w3-margin w3-padding-large",
    "buttonClass":"w3-button w3-theme"
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