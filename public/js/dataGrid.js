class DataSourceConfig {

    getAllUri;
    getNextUri;
    getPrevUri;
    insertUri;
    updateUri;
    deleteUri;
    sortByColumnName;

    constructor(getAllUri, getNextUri, getPrevUri, insertUri, updateUri, deleteUri, sortByColumnName) {
        this.getAllUri = getAllUri;
        this.getNextUri = getNextUri;
        this.getPrevUri = getPrevUri;
        this.insertUri = insertUri;
        this.updateUri = updateUri;
        this.deleteUri = deleteUri;
        this.sortByColumnName = sortByColumnName;
    }
}

class DataGrid {

    tableHeader;
    tableBody;
    dataSourceConfig;
    dataSource;

    dataGridHeader() {
        let header = headerDefinition.headerCells;
        var i;
        for (i = 0; i < header.length; i++) {
            let cell = document.createElement("th")
            this.tableHeader.appendChild(cell);
            cell.className = header[i].cellClass;
            cell.innerHTML = header[i].label;
        }
    }

    dataGridRow(rowNumber, rowData) {

        let fields = rowDefinition.fields;
        let rowClass = rowDefinition.rowClassName;

        let id = rowClass + rowNumber
        let tr = document.createElement("tr");
        tr.className = rowClass;
        tr.id = id;
        this.tableBody.appendChild(tr);
        var i;
        for (i = 0; i < fields.length; i++) {
            let td = document.createElement("td");
            td.id = genId(i, rowNumber);
            td.innerHTML = rowData[fields[i].name];
            td.className = fields[i].className
            tr.appendChild(td)
        }
    }

    constructor(container, className, name, headerDefinition, rowDefinition, rowCount) {

        this.container = container;
        this.className = className;
        this.headerDefinition = headerDefinition;
        this.rowDefinition = rowDefinition;
        this.rowCount = rowCount;
        this.name = name;

        let colCount = this.headerDefinition.headerCells.length;
        let table = document.createElement("table");
        table.className = this.className;
        table.id = this.name;
        this.container.appendChild(table);

        this.tableHeader = document.createElement("tr");
        table.appendChild(this.tableHeader)

        this.dataGridHeader();
        this.tableBody = document.createElement("tbody");
        table.appendChild(this.tableBody)
    }

    build() {
        var i;
        for (i = 0; i < this.rowCount; i++) {
            let rowData = this.dataSource.getRowData(i);
            this.dataGridRow(i, rowData)
        }
    }

}


