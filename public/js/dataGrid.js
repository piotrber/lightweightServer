function dataGridHeader(header, name, tableHeader) {
    this.header = header.headerCells;
    this.tableHeader = tableHeader;
    for (i = 0; i < this.header.length; i++) {
        let cell = document.createElement("th")
        this.tableHeader.appendChild(cell);
        cell.className = this.header[i].cellClass;
        cell.innerHTML = this.header[i].label;
    }
}

function dataGridRow(rowDefinition, rowClass, name, rowNumber, tableBody, rowData) {

    this.fields = rowDefinition.fields;
    this.tableBody = tableBody;
    this.rowClass = rowClass;
    this.name = name;
    this.rowNumber = rowNumber;
    this.rowData = rowData;

    let id = this.name + this.rowNumber
    let tr = document.createElement("tr");
    tr.className = this.rowClass;
    tr.id = id;
    this.tableBody.appendChild(tr);
    for (i = 0; i < this.fields.length; i++) {
        let td = document.createElement("td");
        td.id = genId(i, this.rowNumber);
        td.innerHTML = this.rowData[this.fields[i].name];
        td.className = this.fields[i].className
        tr.appendChild(td)
    }
}

function dataGrid(container, className, name, headerDefinition,rowDefinition, rowClass, rowCount, getRowData) {

    this.container = container;
    this.className = className;
    this.headerDefinition = headerDefinition;
    this.rowDefinition = rowDefinition;
    this.rowClass = rowClass;
    this.rowCount = rowCount;
    this.name = name;

    let colCount = this.headerDefinition.headerCells.length;
    let table = document.createElement("table");
    table.className = this.className;
    table.id = this.name;
    this.container.appendChild(table);

    let tr = document.createElement("tr");
    table.appendChild(tr)

    var header = new dataGridHeader(this.headerDefinition, this.name, tr);
    let tb = document.createElement("tbody");
    table.appendChild(tb)
    var i;
    for (i = 0; i < this.rowCount; i++) {
        let rowData = getRowData(i);
        dataGridRow(this.rowDefinition, this.rowClass, this.name, i, tb, rowData)
    }
}

