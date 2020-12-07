var tableDefinition = {
    "headerClass": "w3-theme",
    "maxHeight": "360px",
    "displayRowCount": 10,
    "rowClass": "",
    "columns": [
        {
            "cellClass": "w3-right-align w3-border",
            "label": "id",
            "inputType": "hidden",
            "inputClass": "w3-input",
            "fieldName": "id",
            "fieldClass": "w3-right-align  w3-border"
        },
        {
            "cellClass": "w3-center  w3-border",
            "label": "First name",
            "inputType": "text",
            "inputClass": "w3-input w3-margin",
            "fieldName": "fname",
            "fieldClass": "w3-center  w3-border",
        },
        {
            "cellClass": "w3-center w3-border",
            "label": "Last name",
            "inputType": "text",
            "inputClass": "w3-input w3-margin",
            "fieldName": "lname",
            "fieldClass": "w3-center  w3-border"
        }
    ],
    "formClassName": "w3-container w3-margin w3-padding-large",
    "buttonClass": "w3-button w3-theme w3-margin"
}

function start(container) {
    dataSourceConfig = new DataSourceConfig("personList","http://localhost:8080/", "all", "updatePerson");
    grid = new DataGrid(container, "w3-table-all w3-hoverable", "dataGrid", tableDefinition);
    dataSource = new DataSource(dataSourceConfig, grid);
}