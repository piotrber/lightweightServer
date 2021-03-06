var tableDefinition = {
    "id": "dgGrid",
    "className": "w3-table-all",
    "headerClass": "w3-theme",
    "editable": "true",
    "displayRowCount": 10,
    "cacheSize": 20,
    "rowClass": "",
    "sortOrderClassName": "w3-large",
    "columns": [
        {
            "cellClass": "w3-right-align w3-border",
            "label": "id",
            "inputType": "hidden",
            "inputClass": "w3-input",
            "fieldName": "id",
            "fieldClass": "w3-right-align  w3-border",
            "sortOrder": "0" // -1 desc +1 asc
        },
        {
            "cellClass": "w3-center  w3-border",
            "label": "First name",
            "inputType": "text",
            "inputClass": "w3-input w3-margin",
            "fieldName": "fname",
            "fieldClass": "w3-center  w3-border",
            "sortOrder": "0"
        },
        {
            "cellClass": "w3-center w3-border",
            "label": "Last name",
            "inputType": "text",
            "inputClass": "w3-input w3-margin",
            "fieldName": "lname",
            "fieldClass": "w3-center  w3-border",
            "sortOrder": "1"
        }
    ],
    "form": {
        "formClass": "w3-container w3-margin w3-padding-large",
        "buttonClass": "w3-button w3-theme w3-margin w3-hover-red"
    },
    "navPanelClass": "w3-container w3-margin w3-padding",
    "navigator": {
        "className": "w3-bar w3-theme w3-left",
        "buttonClass": "w3-bar-item w3-button w3-hover-red",
        "buttons": [
            {"action": "PageUp", "label": "<<"},
            {"action": "ArrowUp", "label": "<"},
            {"action": "ArrowDown", "label": ">"},
            {"action": "PageDown", "label": ">>"},
            {"action": "Insert", "label": "+"},
            {"action": "Delete", "label":"-"}
        ] // all are optional
    },
    "searchInput": {"className": "w3-input w3-margin", "style": "width:30%"}
};

function start() {
    dataSourceConfig = new DataSourceConfig(
        "personList",
        tableDefinition.displayRowCount,
        tableDefinition.cacheSize,
        "http://localhost:8080/",
        "all",
        "updatePerson",
        "page",
        "insertPerson"
    );
    grid = new DataGrid("dataGrid", tableDefinition);
    dataSource = new DataSource(dataSourceConfig, grid);
}