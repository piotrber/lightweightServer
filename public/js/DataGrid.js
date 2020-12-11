class DataGridConfig {
    dataSource;
    tableDiv;
    formDiv;
    navPanel;
    lastTop;
    searchInput;

    constructor(tableDiv, formDiv, navPanel, searchInput) {
        this.formDiv = formDiv;
        this.tableDiv = tableDiv;
        this.navPanel = navPanel;
        this.searchInput = searchInput;
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
    sortFieldName;
    sortOrder;
    eSearchInput;

    navEvents = [{"action": "previous", "handler": this.gridAddTopRow},
        {"action": "next", "handler": this.gridAddBottomRow}];

    gridAddTopRow(event) {
        let data = this.parentNode.parentNode.parentNode.data;
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


    gridAddBottomRow(event) {

        let data = this.parentNode.parentNode.parentNode.data;
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
        parent = parent.parentNode;
        let navPanel = parent.data.navPanel;
        navPanel.style.display = "none";
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
        let data = form.parentNode.data;
        data.tableDiv.style.display = "table";
        data.navPanel.style.display = "block";
        data.searchInput.focus()
    }

    cancelEdit() {
        let form = this.parentNode;
        form.style.display = "none";
        let data = form.parentNode.data;
        data.tableDiv.style.display = "table";
        data.navPanel.style.display = "block";
        data.searchInput.focus()
    }


    clearTable() {
        let row = this.eTableBody.lastChild;
        while (row != undefined) {
            let prev = row.previousSibling;
            row.remove();
            row = prev;
        }
    }


    reloadTable() {
        this.clearTable();
        this.dataSource.reload();
    }

    changeSortOrder() {
        let element = this;
        let newSortOrder = 0;
        if (element.data.sortOrder == 0) {
            let item = element.parentNode.firstChild;
            while (item.data.sortOrder == 0) {
                item = item.nextSibling
            }
            newSortOrder = item.data.sortOrder;
            item.data.sortOrder = 0;
            item.className = tableDefinition.columns[item.data.colNo].cellClass;
            item.innerHTML = tableDefinition.columns[item.data.colNo].label;
            element.className = element.className + " " + tableDefinition.sortOrderClassName;
        } else {
            newSortOrder = -element.data.sortOrder;
        }
        ;

        element.innerHTML = tableDefinition.columns[element.data.colNo].label;
        if (newSortOrder == 1) {
            element.innerHTML = element.innerHTML + " +"
        } else {
            element.innerHTML = "- " + element.innerHTML
        }
        element.data.sortOrder = newSortOrder
        window.grid.sortFieldName = element.data.fieldName;
        window.grid.sortOrder = newSortOrder;

        window.grid.reloadTable();
    }

    scroll(event) {

        let nav = this.parentNode.parentNode.data.navPanel.firstChild;
        if (event.deltaY > 0) {
            nav.data.execute(nav, "next")
        } else {
            nav.data.execute(nav, "previous")
        }
    }

    kbdEvent(event) {
        let nav = this.parentNode.parentNode.data.navPanel.firstChild;
        if (event.code == "ArrowUp") {
            nav.data.execute(nav, "previous")
        };
        if (event.code == "ArrowDown") {
            nav.data.execute(nav, "next");
        }
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

            let sort = header[i].sortOrder;
            if (sort != "0") {

                cell.className = cell.className + " " + tableDefinition.sortOrderClassName
                if (sort == 1) {
                    cell.innerHTML = cell.innerHTML + " +"
                } else {
                    cell.innerHTML = "- " + element.innerHTML
                }
                this.sortFieldName = header[i].fieldName;
                this.sortOrder = header[i].sortOrder;

            }
            cell.data = {"colNo": i, "fieldName": header[i].fieldName, "sortOrder": sort}
            cell.addEventListener("click", this.changeSortOrder)

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
        this.dbNavigator = bar;
        bar.className = tableDefinition.navigator.className;
        this.navPanel.appendChild(bar);
        var i;
        let buttons = tableDefinition.navigator.buttons;
        for (i = 0; i < buttons.length; i++) {
            let btn = document.createElement("button");
            btn.className = tableDefinition.navigator.buttonClass;
            btn.innerHTML = buttons[i].label;
            btn.data = buttons[i].action;
            bar.appendChild(btn);
            var j;
            for (j = 0; j < this.navEvents.length; j++) {
                if (this.navEvents[j].action == buttons[i].action) {
                    btn.addEventListener("click", this.navEvents[j].handler);
                }
            }
        }
        bar.data={"execute":this.dbNavExec};
    }

    dbNavExec(dbNavigator, action) {

        let button = dbNavigator.firstChild;

        while (button.data != action) {
            button = button.nextSibling
        }
        button.click();
    }


    constructor(name, tableDefinition) {

        this.tableDefinition = tableDefinition;
        this.eContainer = document.getElementById(this.tableDefinition.id)
        this.className = this.tableDefinition.className;
        this.rowCount = tableDefinition.displayRowCount;
        this.name = name;

        this.eTable = document.createElement("table");
        this.eTable.className = this.className;
        this.eContainer.appendChild(this.eTable);

        this.eTableHeader = document.createElement("tr");
        this.eTable.appendChild(this.eTableHeader)
        this.createDataGridHeader();

        this.eTableBody = document.createElement("tbody");
        this.eTable.appendChild(this.eTableBody);
        this.eTableBody.addEventListener("wheel", this.scroll)


        this.eForm = document.createElement("div");
        this.eForm.className = this.tableDefinition.formClassName;
        this.eContainer.appendChild(this.eForm);

        if (this.tableDefinition.form != undefined) {
            this.createEditForm()
        }
        ;
        this.navPanel = document.createElement("div");
        this.navPanel.class = this.tableDefinition.navPanel;
        this.eContainer.appendChild(this.navPanel);

        if (this.tableDefinition.navigator != undefined) {
            this.createDbNavigator()
        }
        if (this.tableDefinition.searchInput != undefined) {

            this.eSearchInput = document.createElement("input");
            this.eSearchInput.type = "search"
            this.eSearchInput.className = this.tableDefinition.searchInput.className;
            this.eSearchInput.style = this.tableDefinition.searchInput.style;
            this.navPanel.appendChild(this.eSearchInput);
            this.eSearchInput.addEventListener("keydown", this.kbdEvent)
        }

        this.eContainer.data = new DataGridConfig(this.eTable, this.eForm, this.navPanel, this.eSearchInput);
    }

    build() {
        var i;
        for (i = 0; i < this.rowCount; i++) {
            let rowData = this.dataSource.getRowData(i);
            this.createDataGridRow(i, rowData);
        }
        this.eContainer.data.dataSource = this.dataSource;
        this.eContainer.data.lastTop = 0;
        this.eContainer.data.searchInput.focus();

    }


}


