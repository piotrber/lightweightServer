class DataSource {

    grid;
    dataSourceConfig;
    getAllUrl;
    updateUrl;

    constructor(dataSourceConfig, grid) {

        this.grid = grid;
        this.grid.dataSource = this;
        this.dataSourceConfig = dataSourceConfig;
        this.getAllUrl = dataSourceConfig.getAllUrl;
        this.updateUrl = dataSourceConfig.updateUrl;

        // this.getUrl = getUrl;
        // this.getNextUrl = getNextUrl;
        // this.getPrevUrl = getPrevUrl;
        // this.insertPath = insertUrl;

        // this.deleteUrl = deleteUrl;
        // this.sortByColumnName = sortByColumnName;

        this.loadAll();
    }

    currentId = 0;
    minValue;
    maxValue;
    tableData;


    start(data) {
        this.tableData = data;
        this.grid.build();
    }


    loadAll() {
        $.when(
            $.ajax({
                    url: this.getAllUrl,
                    context: this
                }
            )).then(this.start);
    }

    updateRowData(rowData) {
        $.ajax({
            url:this.updateUrl,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(rowData),
            error: this.checkStatus
        });
    }

    getRowData(i) {
        return this.tableData.personList[i];
    }

    getRow(id) {
        return this.loadRowData(id, this.getUrl)
    }

    getPrevRow(value) {

        let data = this.loadRowData(value, this.getPrevUrl)
        if (data[this.sortByColumnName] < this.minValue) {
            this.minValue = data[this.sortByColumnName]
        }
    }

    getNextRow(value) {

        let data = this.loadRowData(value, this.getNextUrl)
        if (data[this.sortByColumnName] > this.maxValue) {
            this.maxValue = data[this.sortByColumnName]
        }
        return data
    }


    loadRowData(value, getUrl) {
        var dataObject;

        recive(data, status)
        {
            dataObject = data;
            if (data[this.sortByColumnName] > this.maxValue) {
                this.maxValue = data[this.sortByColumnName]
            }
        }

        getObject(value)
        {
            $.get(getUrl + "?" + value + "&" + this.sortByColumnName, recive)
        }
        return dataObject;
    }


    checkStatus(data, status) {
        alert("Data: " + data + "\nStatus: " + status);
    }


}