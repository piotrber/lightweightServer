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
        if (input != undefined) {
            input.focus();
        }
        ;
    }


    gridAddBottomRow(data) {

        let grid = data.owner;
        let last = grid.lastRow;  // last row
        let tbody = last.parentNode;
        let input = tbody.data.lastChild;
        let rowNumber = last.data.rowNumber + 1;
        if (rowNumber < data.dataSource.cacheSize) {
            let rowData = data.dataSource.getRowData(rowNumber);
            if (rowData != null) {
                grid.lastRow = data.dataSource.grid.createDataGridRow(rowNumber, rowData);
                grid.firstRow.remove();
                grid.firstRow = tbody.firstChild;
            }
        }
        if (input != undefined) {
            input.focus();
        }
        ;
    }


    scrollDn() {
        let data = this.parentNode.parentNode.parentNode.data;
        data.engine.gridAddBottomRow(data);
    }

    scrollUp() {

        let data = this.parentNode.parentNode.parentNode.data;
        data.engine.gridAddTopRow(data);
    }


    gridNewPage() {
        let data = this.parentNode.parentNode.parentNode.data;
        let action = this.data;
        var count = data.owner.tableDefinition.displayRowCount;
        var direction;
        if (action == "pgUp") {
            direction = "UP"
        } else direction = "DOWN"
        this.sortFieldName = data.owner.sortFieldName;
        let sortOrder = data.owner.sortOrder;
        data.dataSource.getPage(direction,count);
    }

    scrollN(n) {
        let data = this.grid.eContainer.data;
        data.engine.clearTable();
        data.owner.build();
    }

    displayForm() {
        let parent = this;
        while (parent.tagName != "TABLE") {
            parent = parent.parentNode;
        };
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

    displayNewForm(){}


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
        if (data.searchInput != undefined) {
            data.searchInput.focus();
        }
        ;
    }

    cancelEdit() {
        let form = this.parentNode;
        form.style.display = "none";
        let data = form.parentNode.data;
        data.tableDiv.style.display = "table";
        data.navPanel.style.display = "block";
        if (data.searchInput != undefined) {
            data.searchInput.focus();
        }
        ;
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

    //
    // setFocus(data){
    //     if (data.searchInput != undefined) {data.searchInput.focus()};
    // }

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

    kbdEvent(event) {
        let nav = this.parentNode.firstChild;
        if (event.code == "ArrowUp") {
            nav.data.execute(nav, "previous");
        }
        ;
        if (event.code == "ArrowDown") {
            nav.data.execute(nav, "next");
        }
    }

    dbNavExec(nav, action) {

        let button = nav.firstChild;

        while (button.data != action) {
            button = button.nextSibling;
        }
        button.click();
        if (nav.nextSibling != undefined) {
            nav.nextSibling.focus();
        }
    }


}