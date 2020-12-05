
class
DataGrid
{

    eTableHeader;
    eTableBody;
    dataSourceConfig;
    dataSource;
    eForm;
    eContainer;


    static setEditFormData(element)
    {
        let row = element.parentNode;
        let dataRow = row.data;
        return dataRow;
    }

    static setupRow(rowData)
    {
        let row = rowData[0];
        let rowNumber = rowData[1];
        let fieldsData = rowData[2];

    }

    displayForm()
    {
        window.dgTable.style.display = "none";
        let form = window.dgForm;
        form.style.display = "block";
        let dataRow = DataGrid.setEditFormData(this);
        form.data = dataRow;
        dataRow = dataRow[2];

        var element = form.firstChild;
        while (element.tagName != "BUTTON") {

            if (element.tagName == "INPUT") {
                element.value = dataRow[element.name];
            }
            element = element.nextSibling;
        }
        DataGrid.setupRow(dataRow);
    }

    displayGrid()
    {
        window.dgTable.style.display = "table";
        let form = window.dgForm;
        let element = form.firstChild;
        let formData = form.data;
        let dataRow = formData[1, 1];

        while (element.tagName != "BUTTON") {

            if (element.tagName == "INPUT") {
                dataRow[element.name] = element.value;
            }
            element = element.nextSibling;
        }

    }

    dataGridHeader()
    {
        this.eTableHeader.className = headerDefinition.headerClass;
        let header = headerDefinition.headerCells;
        var i;
        for (i = 0; i < header.length; i++) {
            let cell = document.createElement("th")
            this.eTableHeader.appendChild(cell);
            cell.className = header[i].cellClass;
            cell.innerHTML = header[i].label;
        }
    }


    createEditForm()
    {

        this.eForm.style.display = "none";
        this.eForm.id = "dgForm";
        this.eForm.style.minHeight = headerDefinition.maxHeight;
        this.eForm.width = this.eContainer.width;
        let header = headerDefinition.headerCells;
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
        button.className = headerDefinition.buttonClass;
        this.eForm.appendChild(button);
        button.addEventListener("click", this.displayGrid);
        button.innerHTML = "Save";
    }


    dataGridRow(rowNumber, rowData)
    {

        let fields = rowDefinition.fields;
        let rowClass = rowDefinition.rowClassName;

        let tr = document.createElement("tr");
        tr.className = rowClass;
        tr.data = [tr,rowNumber, rowData];
        this.eTableBody.appendChild(tr);
        var i;
        for (i = 0; i < fields.length; i++) {
            let td = document.createElement("td");
            td.innerHTML = rowData[fields[i].name];
            td.className = fields[i].fieldClass;
            td.addEventListener("click", this.displayForm);
            tr.appendChild(td)
        }
    }


    constructor(container, className, name, headerDefinition, rowDefinition, rowCount)
    {

        this.eContainer = container;
        this.className = className;
        this.headerDefinition = headerDefinition;
        this.rowDefinition = rowDefinition;
        this.rowCount = rowCount;
        this.name = name;

        this.eContainer.style.maxHeight = this.headerDefinition.maxHeight;
        this.eContainer.style.overflow = "auto"

        this.eTable = document.createElement("table");
        this.eTable.className = this.className;
        this.eTable.id = "dgTable";
        this.eContainer.appendChild(this.eTable);

        this.eTableHeader = document.createElement("tr");
        this.eTable.appendChild(this.eTableHeader)
        this.dataGridHeader();

        this.eTableBody = document.createElement("tbody");
        this.eTable.appendChild(this.eTableBody)

        this.eForm = document.createElement("div");
        this.eForm.className = this.headerDefinition.formClassName;
        this.eContainer.appendChild(this.eForm);
        this.createEditForm();
    }

    build()
    {
        var i;
        for (i = 0; i < this.rowCount; i++) {
            let rowData = this.dataSource.getRowData(i);
            this.dataGridRow(i, rowData);
        }
    }

}


