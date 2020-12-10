var tableDefinition = {
    "headerClass": "w3-theme",
    "editable":"true",
    "displayRowCount": 10,
    "rowClass": "w3-hover-red",
    "sortOrderClassName":"w3-large",
    "columns": [
        {
            "cellClass": "w3-right-align w3-border",
            "label": "id",
            "inputType": "hidden",
            "inputClass": "w3-input",
            "fieldName": "id",
            "fieldClass": "w3-right-align  w3-border",
            "sortOrder":"0" // -1 desc +1 asc
        },
        {
            "cellClass": "w3-center  w3-border",
            "label": "First name",
            "inputType": "text",
            "inputClass": "w3-input w3-margin",
            "fieldName": "fname",
            "fieldClass": "w3-center  w3-border",
            "sortOrder":"0"
        },
        {
            "cellClass": "w3-center w3-border",
            "label": "Last name",
            "inputType": "text",
            "inputClass": "w3-input w3-margin",
            "fieldName": "lname",
            "fieldClass": "w3-center  w3-border",
            "sortOrder":"1"
        }
    ],
    "form": {
        "formClass": "w3-container w3-margin w3-padding-large",
        "buttonClass": "w3-button w3-theme w3-margin w3-hover-red"
    },
    "navigator": {
        "className": "w3-bar w3-theme w3-left w3-margin",
        "buttonClass": "w3-bar-item w3-button w3-hover-red",
        "buttons": [
            {"action": "first", "label": "|<"},
            {"action": "pgDn", "label": "<<"},
            {"action": "previous", "label": "<"},
            {"action": "next", "label": ">"},
            {"action": "pgUp", "label": ">>"},
            {"action": "insert", "label": "+"}
            ] // all are optional
    }
}

function start(container) {
    dataSourceConfig = new DataSourceConfig("personList", "http://localhost:8080/", "all", "updatePerson");
    grid = new DataGrid(container, "w3-table-all w3-hoverable", "dataGrid", tableDefinition);
    dataSource = new DataSource(dataSourceConfig, grid);
}