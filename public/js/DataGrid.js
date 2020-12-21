class DataGridConfig {
    owner;
    dataSource;
    tableDiv;
    formDiv;
    navPanel;
    searchInput;
    engine;
    firstRow;
    lastRow;
    activeRow;
    navEvents;

    constructor(owner, tableDiv, formDiv, navPanel, searchInput, engine) {
        this.owner = owner;
        this.formDiv = formDiv;
        this.tableDiv = tableDiv;
        this.navPanel = navPanel;
        this.searchInput = searchInput;
        this.engine = engine;
    }
}


class DataGrid {

    eTableHeader;
    eTableBody;
    dataSource;
    eForm;
    eContainer;
    tableDefinition;
    eSearchInput;
    navEvents;
    engine;

    createDataGridHeader() {

        this.eTableHeader.className = tableDefinition.headerClass;
        let header = tableDefinition.columns;
        var i;
        for (i = 0; i < header.length; i++) {

            let cell = document.createElement("th");
            this.eTableHeader.appendChild(cell);
            cell.className = header[i].cellClass;
            cell.innerHTML = header[i].label;

            let sort = header[i].sortOrder;
            if (sort != "0") {

                cell.className = cell.className + " " + tableDefinition.sortOrderClassName;
                if (sort == 1) {
                    cell.innerHTML = cell.innerHTML + " +";
                } else {
                    cell.innerHTML = "- " + element.innerHTML;
                }
            }
            cell.data = {"colNo": i, "fieldName": header[i].fieldName, "sortOrder": sort, "owner": this.eContainer};
            cell.addEventListener("click", this.engine.changeSortOrder);

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
                let label = document.createElement("label");
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
        button.addEventListener("click", this.engine.displayGrid);
        button.innerHTML = "Save";

        button = document.createElement("button");
        button.inputType = "button";
        button.className = tableDefinition.form.buttonClass;
        this.eForm.appendChild(button);
        button.addEventListener("click", this.engine.cancelEdit);
        button.innerHTML = "Cancel";

    }

    createDataGridRow(rowNumber, rowData) {

        let fields = tableDefinition.columns;
        let rowClass = tableDefinition.rowClass;

        let tr = document.createElement("tr");
        tr.className = rowClass;
        tr.data = {"element": tr, "rowNumber": rowNumber, "rowData": rowData};
        tr.tabIndex = 1000*rowNumber;
        tr.addEventListener("keydown",this.engine.keybordEvent);
        this.eTableBody.appendChild(tr);
        var i;
        for (i = 0; i < fields.length; i++) {
            let td = document.createElement("td");
            td.innerHTML = rowData[fields[i].fieldName];
            td.className = fields[i].fieldClass;
            tr.appendChild(td);
            td.addEventListener("dblclick", this.engine.displayForm);
        }
        return tr;
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
            btn.data = { "action":buttons[i].action, "owner":this.eContainer} ;
            bar.appendChild(btn);
            var j;
            for (j = 0; j < this.navEvents.length; j++) {
                if (this.navEvents[j].action == buttons[i].action) {
                    btn.addEventListener("click", this.navEvents[j].handler);
                }
            }
        }
        bar.data = {"execute": this.engine.dbNavExec};
        this.eTableBody.data = this.engine;
    }


    constructor(name, tableDefinition) {
        this.engine = new DataGridEngine(this);


        this.navEvents = [
            {"action": "PageUp", "handler": this.engine.gridNewPage},
            {"action": "ArrowUp", "handler": this.engine.scrollUp},
            {"action": "ArrowDown", "handler": this.engine.scrollDn},
            {"action": "PageDown", "handler": this.engine.gridNewPage},
            {"action":"Insert","handler": this.engine.displayNewForm},
            {"action":"Delete","handler": this.engine.toDo}
        ];


        this.tableDefinition = tableDefinition;
        this.eContainer = document.getElementById(this.tableDefinition.id);
        this.className = this.tableDefinition.className;
        this.rowCount = tableDefinition.displayRowCount;
        this.name = name;

        this.eTable = document.createElement("table");
        this.eTable.className = this.className;
        this.eContainer.appendChild(this.eTable);

        this.eTableHeader = document.createElement("tr");
        this.eTable.appendChild(this.eTableHeader);
        this.createDataGridHeader();

        this.eTableBody = document.createElement("tbody");
        this.eTable.appendChild(this.eTableBody);
        this.eTableBody.addEventListener("wheel", this.engine.scroll);


        this.eForm = document.createElement("div");
        this.eForm.className = this.tableDefinition.formClassName;
        this.eContainer.appendChild(this.eForm);

        if (this.tableDefinition.form != undefined) {
            this.createEditForm();
        }
        ;
        this.navPanel = document.createElement("div");
        this.navPanel.class = this.tableDefinition.navPanel;
        this.eContainer.appendChild(this.navPanel);

        if (this.tableDefinition.navigator != undefined) {
            this.createDbNavigator();
        }
        if (this.tableDefinition.searchInput != undefined) {

            this.eSearchInput = document.createElement("input");
            this.eSearchInput.type = "search";
            this.eSearchInput.className = this.tableDefinition.searchInput.className;
            this.eSearchInput.style = this.tableDefinition.searchInput.style;
            this.navPanel.appendChild(this.eSearchInput);
            this.eSearchInput.addEventListener("keydown", this.engine.kbdEvent);
        }

        this.eContainer.data = new DataGridConfig(this, this.eTable, this.eForm, this.navPanel, this.eSearchInput, this.engine);
    }

    build() {
        var i;
        let tr;
        for (i = 0; i < this.rowCount; i++) {

            let rowData = this.dataSource.getRowData(i);
            tr = this.createDataGridRow(i, rowData);
            if (i == 0) {
                this.firstRow = tr;
            } else {
                this.lastRow = tr;
            }
        }
        this.eContainer.data.dataSource = this.dataSource;
        this.eContainer.data.lastTop = 0;
        this.eContainer.data.firstRow = this.firstRow;
        this.eContainer.data.lastRow = this.lastRow;
        if (this.eContainer.data.searchInput != undefined) {
            this.eContainer.data.searchInput.focus();
        }
        ;

    }

    getSortData() {
        var i;
        let tr = this.tableDefinition.columns;
        for (i = 0; i < tr.length; i++) {
            if (tr[i].sortOrder != 0) {
                this.dataSource.sortOrder = tr[i].sortOrder;
                this.dataSource.sortFieldName = tr[i].fieldName;
            }
        }

    }
}