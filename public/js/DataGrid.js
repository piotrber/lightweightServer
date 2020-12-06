class DataGrid {

    eTableHeader;
    eTableBody;
    dataSourceConfig;
    dataSource;
    eForm;
    eContainer;
    topOfGrid;

    gridScroll() {
        let currentTop = window.grid.eContainer.scrollTop;
        if ((this.topOfGrid-currentTop)>0){
            this.result.innerHTML = ">0";
        };
    }

    displayForm() {
        window.dgTable.style.display = "none";
        let form = window.dgForm;
        form.style.display = "block";
        let formData = this.parentNode.data;
        form.data = formData;
        let dataRow = formData.rowData;
        var isFocusChoosen = false;
        var focused;
        var element = form.firstChild;
        while (element.tagName != "BUTTON") {

            if (element.tagName == "INPUT") {
                element.value = dataRow[element.name];
                if (!isFocusChoosen && (element.type != "hidden")) {
                    focused = element;
                    isFocusChoosen = true
                }
                ;
            }
            element = element.nextSibling;
        }
        focused.focus();
    }

    displayGrid() {
        window.dgTable.style.display = "table";
        let form = window.dgForm;
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
        window.dataSource.updateRowData(dataRow);
        window.dgForm.style.display = "none"
    }

    cancelEdit() {
        window.dgTable.style.display = "table";
        window.dgForm.style.display = "none"
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
        this.eForm.id = "dgForm";
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
        button.className = tableDefinition.buttonClass;
        this.eForm.appendChild(button);
        button.addEventListener("click", this.displayGrid);
        button.innerHTML = "Save";

        button = document.createElement("button");
        button.inputType = "button";
        button.className = tableDefinition.buttonClass;
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


    constructor(container, className, name, tableDefinition) {

        this.eContainer = container;
        this.className = className;
        this.headerDefinition = tableDefinition;
        this.rowCount = tableDefinition.displayRowCount;
        this.name = name;

        this.eContainer.style.maxHeight = this.headerDefinition.maxHeight;
        this.eContainer.style.overflow = "auto"
        this.eContainer.addEventListener("scroll", this.gridScroll);

        this.eTable = document.createElement("table");
        this.eTable.className = this.className;
        this.eTable.id = "dgTable";
        this.eContainer.appendChild(this.eTable);

        this.eTableHeader = document.createElement("tr");
        this.eTable.appendChild(this.eTableHeader)
        this.createDataGridHeader();

        this.eTableBody = document.createElement("tbody");
        this.eTable.appendChild(this.eTableBody)

        this.eForm = document.createElement("div");
        this.eForm.className = this.headerDefinition.formClassName;
        this.eContainer.appendChild(this.eForm);
        this.createEditForm();
    }

    build() {
        var i;
        for (i = 0; i < this.rowCount; i++) {
            let rowData = this.dataSource.getRowData(i);
            this.createDataGridRow(i, rowData);
        }
        this.topOfGrid = 0;
    }

}


