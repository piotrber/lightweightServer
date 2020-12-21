class DataGridEngine {

    grid;

    constructor(grid) {
        this.grid = grid;
        grid.engine = this;
    }


    gridAddTopRow(data) {

        let grid = data.owner;
        let first = grid.firstRow;  // first row
        let tbody = first.parentNode;
        let input = tbody.data.lastChild;
        let rowNumber = first.data.rowNumber - 1;
        if (rowNumber >= 0) {
            let rowData = data.dataSource.getRowData(rowNumber);
            grid.firstRow = data.dataSource.grid.createDataGridRow(rowNumber, rowData);
            tbody.insertBefore(tbody.lastChild, tbody.firstChild);
            tbody.lastChild.remove();
            grid.lastRow = tbody.lastChild;
        }
    };


    gridAddBottomRow(engine) {

        let grid = engine.grid;
        let last = grid.lastRow;  // last row
        let tbody = last.parentNode;
        let input = tbody.data.lastChild;
        let rowNumber = last.data.rowNumber + 1;
        if (rowNumber < grid.dataSource.cacheSize) {
            let rowData = data.dataSource.getRowData(rowNumber);
            if (rowData != null) {
                grid.lastRow = grid.createDataGridRow(rowNumber, rowData);
                grid.firstRow.remove();
                grid.firstRow = tbody.firstChild;
            }
        }
    }


    scrollDn() {
        let data = this.parentNode.parentNode.parentNode.data;
        data.engine.gridAddBottomRow(data);
    }

    scrollUp() {

        let config = this.parentNode.parentNode.parentNode.data;
        config.engine.gridAddTopRow(config);
    }


    gridNewPage(engine,action) {
        var grid = engine.grid;
        var count = grid.tableDefinition.displayRowCount;
        var direction;
        if (action == "PageUp") {
            direction = "UP";
        } else direction = "DOWN";
        this.sortFieldName = grid.sortFieldName;
        let sortOrder = grid.sortOrder;
        grid.dataSource.getPage(direction, count);
    }

    scrollN(n) {
        if (n > 0) {
            let data = this.grid.eContainer.data;
            data.engine.clearTable();
            data.owner.build();
        }

    }

    displayForm() {
        let parent = this;
        while (parent.tagName != "TABLE") {
            parent = parent.parentNode;
        }
        ;
        parent.style.display = "none";
        let form = parent.parentNode.data.formDiv;
        form.style.display = "block";
        let formData = this.parentNode.data;
        form.data = formData;
        let dataRow = formData.rowData;
        delete dataRow.owner;
        var isFocusSet = false;
        var focused;
        var element = form.firstChild;
        while (element.tagName != "BUTTON") {

            if (element.tagName == "INPUT") {
                element.value = dataRow[element.name];
                if (!isFocusSet && (element.type != "hidden")) {
                    focused = element;
                    isFocusSet = true;
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

    displayNewForm() {
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
        let config = form.parentNode.data;
        config.tableDiv.style.display = "table";
        config.navPanel.style.display = "block";
        config.engine.setFocus(config.owner.eSearchInput);
    }

    cancelEdit() {
        let form = this.parentNode;
        form.style.display = "none";
        let data = form.parentNode.data;
        form.data.rowData.owner = data.dataSource;
        data.tableDiv.style.display = "table";
        data.navPanel.style.display = "block";
        data.engine.setFocus(data.searchInput);
    }


    clearTable() {
        let row = grid.eTableBody.lastChild;
        while (row != undefined) {
            let prev = row.previousSibling;
            row.remove();
            row = prev;
        }
    }

    reloadTable() {
        this.clearTable();
        this.grid.dataSource.reload();
    }


    setFocus(input) {
        if (input != undefined) {
            input.focus();
        }
        ;
    }

    changeSortOrder() {
        let element = this;
        let grid = element.data.owner.data.owner;
        let newSortOrder = 0;
        if (element.data.sortOrder == 0) {
            let item = element.parentNode.firstChild;
            while (item.data.sortOrder == 0) {
                item = item.nextSibling;
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
            element.innerHTML = element.innerHTML + " +";
        } else {
            element.innerHTML = "- " + element.innerHTML;
        }
        element.data.sortOrder = newSortOrder;
        grid.dataSource.sortFieldName = element.data.fieldName;
        grid.dataSource.sortOrder = newSortOrder;
        grid.engine.reloadTable();
    }

    scroll(event) {

        let nav = this.data;
        if (event.deltaY > 0) {
            nav.data.execute(nav, "next");
        } else {
            nav.data.execute(nav, "previous");
        }
        if (nav.nextSibling != undefined) {
            nav.nextSibling.focus();
        }
    }

    navAction(action) {

        let actions = this.grid.navEvents;
        var engine = this;
        actions.forEach(
            function(it) {
                if (it.action == action) {
                    it.handler(engine,action);
                }
        });
    }

    keybordEvent(event){
        let engine = this.parentNode.data;
        engine.navAction(event.code)
    }


    kbdEvent(event) {
        let nav = this.parentNode.firstChild;
        if (event.code == "ArrowUp") {
            nav.data.execute(nav, "previous");
        }
        ;
        if (event.code == "PageUp") {
            nav.data.execute(nav, "pgUp");
        }
        ;
        if (event.code == "ArrowDown") {
            nav.data.execute(nav, "next");
        }
        if (event.code == "PageDown") {
            nav.data.execute(nav, "pgDn");
        }
        ;
    }

    dbNavExec(nav, action) {

        let button = nav.firstChild;

        while (button.data.action != action) {
            button = button.nextSibling;
        }
        button.click();
        if (nav.nextSibling != undefined) {
            nav.nextSibling.focus();
        }
    }

    toDo() {
        window.alert("TODO");
    }

}