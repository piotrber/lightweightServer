class DataSource {

    grid;
    dataSourceConfig;
    getAllUrl;
    getPageUrl;
    updateUrl;
    tableName;
    rowCount;
    sortFieldName;
    sortOrder;
    minValue;
    maxValue;

    tableData;


    constructor(dataSourceConfig, grid) {

        this.grid = grid;
        this.grid.dataSource = this;
        this.dataSourceConfig = dataSourceConfig;
        this.rowCount = dataSourceConfig.rowCount;
        this.getAllUrl = dataSourceConfig.getAllUrl;
        this.updateUrl = dataSourceConfig.updateUrl;
        this.tableName = dataSourceConfig.tableName;
        this.getPageUrl = dataSourceConfig.getPageUrl;
        this.loadAll();
    }


    start(data) {
        this.tableData = data[this.tableName];
        this.reload()
    }

    reload() {
        this.sortFieldName = this.grid.sortFieldName;
        this.sortOrder = this.grid.sortOrder;
        this.tableData.sort(this.compare);
        this.minValue = this.tableData[0][this.sortFieldName];
        this.maxValue = this.tableData[this.tableData.length - 1][this.sortFieldName];
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
            url: this.updateUrl,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(rowData),
            error: this.checkStatus
        });
    }

    getRowData(i) {

        if (i > this.maxIndex) {
            this.maxIndex = i
        }

        if (i < this.tableData.length) {
            return this.tableData[i];
        } else {
            return null;
        }
    }

    loadPage(data,status,xhr) {

        this.tableData = data;


    }


    getPage() {

        var value;

        if ((this.sortOrder == 1) && (this.rowCount > 0)
            || ((this.sortOrder == -1) && (this.rowCount < 0))) {
            value = this.maxValue
        } else {
            value = this.minValue
        }
        var sortOrderStr;
        if (this.sortOrder=1) { sortOrderStr="ASC"} else {sortOrderStr = "DESC"}
        let selectParams = new SelectParams(this.rowCount, this.sortFieldName,value, sortOrderStr)

        let data = JSON.stringify(selectParams);
        $.ajax({
            url: this.getPageUrl,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(selectParams),
            error: this.checkStatus,
            success:this.loadPage
        });


    }


    //
    // getRow(id) {
    //     return this.loadRowData(id, this.getUrl)
    // }
    //
    // getPrevRow(value) {
    //
    //     let data = this.loadRowData(value, this.getPrevUrl)
    //     if (data[this.sortByColumnName] < this.minValue) {
    //         this.minValue = data[this.sortByColumnName]
    //     }
    // }
    //
    // getNextRow(value) {
    //
    //     let data = this.loadRowData(value, this.getNextUrl)
    //     if (data[this.sortByColumnName] > this.maxValue) {
    //         this.maxValue = data[this.sortByColumnName]
    //     }
    //     return data
    // }
    //
    //
    // loadRowData(value, getUrl) {
    //     var dataObject;
    //
    //     recive(data, status)
    //     {
    //         dataObject = data;
    //         if (data[this.sortByColumnName] > this.maxValue) {
    //             this.maxValue = data[this.sortByColumnName]
    //         }
    //     }
    //
    //     getObject(value)
    //     {
    //         $.get(getUrl + "?" + value + "&" + this.sortByColumnName, recive)
    //     }
    //     return dataObject;
    // }
    //

    checkStatus(xhr) {
        alert("Error " + xhr.status + "\nStatus: " + xhr.statusText);
    }

    compare(a, b) {

        let col = window.dataSource.sortFieldName;
        let sortOrder = window.dataSource.sortOrder;

        if (isNaN(a[col])) {
            if (a[col] > b[col]) {
                return sortOrder
            } else {
                return -sortOrder
            }
        } else return (a[col] - b[col]) * sortOrder

    }
}