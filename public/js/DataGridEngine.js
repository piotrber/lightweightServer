class DataGridEngine {

    grid;

    constructor(grid) {
        this.grid = grid;
    }


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
            data.dataSource.grid.createDataGridRow(rowNumber, rowData);
            element.insertBefore(element.lastChild, element.firstChild);
            element.lastChild.remove();
        }
        if (data.searchInput != undefined) {
            data.searchInput.focus()
        };
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
            data.dataSource.grid.createDataGridRow(rowNumber, rowData);
            element.firstChild.remove();
        }
        if (data.searchInput != undefined) {
            data.searchInput.focus()
        }
        ;
    }


    gridNewPage() {
        let data = this.parentNode.parentNode.parentNode.data
        let action = this.data;
        var count = data.owner.tableDefinition.displayRowCount;
        if (action == "pgUp") {
            count = - count;
        }
        this.sortFieldName = data.owner.sortFieldName;
        let sortOrder = data.owner.sortOrder;
        data.dataSource.getPage(count,this.sortFieldName,sortOrder);
    }


    displayForm() {
        let parent = this;
        while (parent.tagName != "TABLE") {
            parent = parent.parentNode
        };
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
                };
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
        if (data.searchInput != undefined) {
            data.searchInput.focus()
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
            data.searchInput.focus()
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
        grid.sortFieldName = element.data.fieldName;
        grid.sortOrder = newSortOrder;

        grid.engine.reloadTable();
    }

    scroll(event) {

        let nav = this.data;
        if (event.deltaY > 0) {
            nav.data.execute(nav, "next")
        } else {
            nav.data.execute(nav, "previous")
        }
        if (nav.nextSibling != undefined) {
            nav.nextSibling.focus()
        }
    }

    kbdEvent(event) {
        let nav = this.parentNode.firstChild;
        if (event.code == "ArrowUp") {
            nav.data.execute(nav, "previous")
        };
        if (event.code == "ArrowDown") {
            nav.data.execute(nav, "next");
        }
    }

    dbNavExec(nav, action) {

        let button = nav.firstChild;

        while (button.data != action) {
            button = button.nextSibling
        }
        button.click();
        if (nav.nextSibling != undefined) {
            nav.nextSibling.focus()
        }
    }


}