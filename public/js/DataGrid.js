class DataGrid {

    tableHeader;
    tableBody;
    dataSourceConfig;
    dataSource;
    result;
    form;

    onEnter() {
        let form = document.getElementById("form");
        let container = document.getElementById("table");
        form.style.display = "block";
        form.width = container.width;
        form.height = container.height;
        form.top = "0px"

    }


    dataGridHeader() {
        this.tableHeader.className = headerDefinition.headerClass;
        let header = headerDefinition.headerCells;
        var i;
        for (i = 0; i < header.length; i++) {
            let cell = document.createElement("th")
            this.tableHeader.appendChild(cell);
            cell.className = header[i].cellClass;
            cell.innerHTML = header[i].label;
        }
    }

    editForm() {

        this.form = document.createElement("div");
        this.form.className = this.headerDefinition.formClassName;
        this.container.appendChild(this.form);
        this.form.style.display = "none";
        this.form.id = "form";
        let header = headerDefinition.headerCells;
        var i;
        for (i = 0; i < header.length; i++) {
            if (header[i].inputType != "hidden") {
                let label = document.createElement("label")
                label.innerHTML = header[i].label;
                this.form.appendChild(label);
                let input = document.createElement("input");
                input.type = header[i].inputType;
                this.form.appendChild(input);
            }
        }
    }


    dataGridRow(rowNumber, rowData) {

        let fields = rowDefinition.fields;
        let rowClass = rowDefinition.rowClassName;

        let tr = document.createElement("tr");
        tr.className = rowClass;
        tr.data = rowData;
        this.tableBody.appendChild(tr);
        var i;
        for (i = 0; i < fields.length; i++) {
            let td = document.createElement("td");
            td.innerHTML = rowData[fields[i].name];
            td.className = fields[i].fieldClass;
            td.addEventListener("click", this.onEnter);
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

        this.container.style.maxHeight = "360px"
        this.container.style.overflow = "auto"

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

        this.result = document.getElementById("result");
        this.editForm();
    }

    build() {
        var i;
        for (i = 0; i < this.rowCount; i++) {
            let rowData = this.dataSource.getRowData(i);
            this.dataGridRow(i, rowData)
        }
    }

}


