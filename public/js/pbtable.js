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

function dataGridRow(row, rowClass, name, rowNumber, tableBody, getData) {

    this.fields = row.fields;
    this.tableBody = tableBody;
    this.rowClass = rowClass;
    this.name = name;
    this.rowNumber = rowNumber;
    this.getData = getData;

    let id = this.name + this.rowNumber
    let tr = document.createElement("tr");
    tr.className = this.rowClass;
    tr.id = id;
    this.tableBody.appendChild(tr);
    for (i = 0; i < this.fields.length; i++) {
        let td = document.createElement("td");
        td.id = genId(i, this.rowNumber);
        td.innerHTML = getData(this.rowNumber, this.fields[i].name);
        td.className = this.fields[i].className
        tr.appendChild(td)
    }
}

function dataGrid(container, className, name, headerData, headerClass, rowData, rowClass, rowCount, getData) {

    this.container = container;
    this.className = className;
    this.headerData = headerData;
    this.rowData = rowData;
    this.headerClass = headerClass;
    this.rowClass = rowClass;
    this.rowCount = rowCount;
    this.name = name;

    let colCount = this.headerData.headerCells.length;
    let table = document.createElement("table");
    table.className = this.className;
    table.id = this.name;
    this.container.appendChild(table);
    //
    // let th = document.createElement("theader");
    // th.className = this.headerClass;
    // table.appendChild(th);

    let tr = document.createElement("tr");
    table.appendChild(tr)

    var header = new dataGridHeader(this.headerData, this.name, tr);
    let tb = document.createElement("tbody");
    table.appendChild(tb)
    var i;
    for (i = 0; i < this.rowCount; i++) {
        var row = new dataGridRow(this.rowData, this.rowClass, this.name, i, tb, getData)
    }
}

