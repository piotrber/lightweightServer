class DataGridConfig {
    dataSource;
    tableDiv;
    formDiv;
    lastTop;

    constructor(tablediv, formDiv) {
        this.formDiv = formDiv;
        this.tableDiv = tablediv;
    }
}


class DataGrid {

    eTableHeader;
    eTableBody;
    dataSourceConfig;
    dataSource;
    eForm;
    eContainer;
    tableDefinition;

    navEvents = [{"action": "previous", "handler": this.gridAddTopRow},
        {"action": "next", "handler": this.gridAddBottomRow}];

    gridAddTopRow() {
        let data = this.parentNode.parentNode.data;
        let table = data.tableDiv;
        let element = table.firstChild;
        while (element.tagName != "TBODY") {
            element = element.nextSibling
        }

        let first = element.firstChild;  // first row
        let rowNumber = first.data.rowNumber - 1;
        if (rowNumber >= 0) {
            let rowData = data.dataSource.getRowData(rowNumber);
            grid.createDataGridRow(rowNumber, rowData);
            element.insertBefore(element.lastChild, element.firstChild);
            element.lastChild.remove();
        }
    }


    gridAddBottomRow() {

        let data = this.parentNode.parentNode.data;
        let table = data.tableDiv;
        let element = table.firstChild;
        while (element.tagName != "TBODY") {
            element = element.nextSibling
        }

        let last = element.lastChild;  // last row
        let rowNumber = last.data.rowNumber + 1;
        let rowData = data.dataSource.getRowData(rowNumber);
        if (rowData != null) {
            grid.createDataGridRow(rowNumber, rowData);
            element.firstChild.remove();
        }
    }


    displayForm() {
        let parent = this;
        while (parent.tagName != "TABLE") {
            parent = parent.parentNode
        }
        ;
        parent.style.display = "none";
        let form = parent.parentNode.data.formDiv;
        form.style.display = "block";
        let formData = this.parentNode.data;
        form.data = formData;
        let dataRow = formData.rowData;
        var isFocusSet = false;
        var focused;
        var element = form.firstChild;
        while (element.tagName != "BUTTON") {

            if (element.tagName == "INPUT") {
                element.value = dataRow[element.name];
                if (!isFocusSet && (element.type != "hidden")) {
                    focused = element;
                    isFocusSet = true
                }
                ;
            }
            element = element.nextSibling;
        }
        focused.focus();
    }

    displayGrid() {
        let form = this.parentNode;
        form.style.display = "none";
        let element = form.firstChild;
        let formData = form.data;
        let dataRow = formData.rowData;
        let cell = formData.element.firstChild;
        while (element.tagName != "BUTTON") {

            if (element.tagName == "INPUT") {
                dataRow[element.name] = element.value;
                cell.innerHTML = element.value;
                cell = cell.nextSibling;
            }
            element = element.nextSibling;
        }
        form.parentNode.data.dataSource.updateRowData(dataRow);
        form.parentNode.data.tableDiv.style.display = "table"
    }

    cancelEdit() {
        let form = this.parentNode;
        form.style.display = "none"
        form.parentNode.data.tableDiv.style.display = "table";

    }

    createDataGridHeader() {
        this.eTableHeader.className = tableDefinition.headerClass;
        let header = tableDefinition.columns;
        var i;
        for (i = 0; i < header.length; i++) {
            let cell = document.createElement("th")
            this.eTableHeader.appendChild(cell);
            cell.className = header[i].cellClass;
            cell.innerHTML = header[i].label;
        }
    }


    createEditForm() {

        this.eForm.style.display = "none";
        this.eForm.style.minHeight = tableDefinition.maxHeight;
        this.eForm.width = this.eContainer.width;
        let header = tableDefinition.columns;
        var i;
        for (i = 0; i < header.length; i++) {

            let input = document.createElement("input");
            input.type = header[i].inputType;
            input.className = header[i].inputClass;
            if (header[i].inputType != "hidden") {
                let label = document.createElement("label")
                label.innerHTML = header[i].label;
                this.eForm.appendChild(label);
            }
            input.name = header[i].fieldName;
            this.eForm.appendChild(input);
            this.eForm.appendChild(input);
        }

        let button = document.createElement("button");
        button.inputType = "button";
        button.className = tableDefinition.form.buttonClass;
        this.eForm.appendChild(button);
        button.addEventListener("click", this.displayGrid);
        button.innerHTML = "Save";

        button = document.createElement("button");
        button.inputType = "button";
        button.className = tableDefinition.form.buttonClass;
        this.eForm.appendChild(button);
        button.addEventListener("click", this.cancelEdit);
        button.innerHTML = "Cancel";
        this.eContainer.data.formDiv = this.eForm;

    }

    createDataGridRow(rowNumber, rowData) {

        let fields = tableDefinition.columns;
        let rowClass = tableDefinition.rowClass;

        let tr = document.createElement("tr");
        tr.className = rowClass;
        tr.data = {"element": tr, "rowNumber": rowNumber, "rowData": rowData};
        this.eTableBody.appendChild(tr);
        var i;
        for (i = 0; i < fields.length; i++) {
            let td = document.createElement("td");
            td.innerHTML = rowData[fields[i].fieldName];
            td.className = fields[i].fieldClass;
            td.addEventListener("click", this.displayForm);
            tr.appendChild(td)
        }
    }

    createDbNavigator() {

        let bar = document.createElement("div");
        bar.className = tableDefinition.navigator.className;
        this.eContainer.appendChild(bar);
        var i;
        let buttons = tableDefinition.navigator.buttons;
        for (i = 0; i < buttons.length; i++) {
            let btn = document.createElement("button");
            btn.className = tableDefinition.navigator.buttonClass;
            btn.innerHTML = buttons[i].label;
            bar.appendChild(btn);
            var j;
            for (j = 0; j < this.navEvents.length; j++) {
                if (this.navEvents[j].action == buttons[i].action) {
                    btn.addEventListener("click", this.navEvents[j].handler);
                }
            }
        }
    }


    constructor(container, className, name, tableDefinition) {

        this.eContainer = container;
        this.className = className;
        this.headerDefinition = tableDefinition;
        this.rowCount = tableDefinition.displayRowCount;
        this.name = name;
        this.tableDefinition = tableDefinition;

        this.eTable = document.createElement("table");
        this.eTable.className = this.className;
        this.eContainer.appendChild(this.eTable);

        this.eTableHeader = document.createElement("tr");
        this.eTable.appendChild(this.eTableHeader)
        this.createDataGridHeader();

        this.eTableBody = document.createElement("tbody");
        this.eTable.appendChild(this.eTableBody)

        this.eForm = document.createElement("div");
        this.eForm.className = this.headerDefinition.formClassName;
        this.eContainer.appendChild(this.eForm);
        this.eContainer.data = new DataGridConfig(this.eTable, this.eForm);
        if (this.tableDefinition.form != undefined) {
            this.createEditForm()
        }
        ;
        if (this.tableDefinition.navigator != undefined) {
            this.createDbNavigator()
        }
    }

    build() {
        var i;
        for (i = 0; i < this.rowCount; i++) {
            let rowData = this.dataSource.getRowData(i);
            this.createDataGridRow(i, rowData);
        }
        this.eContainer.data.dataSource = this.dataSource;
        this.eContainer.data.lastTop = 0;
    }


}


