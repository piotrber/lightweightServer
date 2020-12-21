class DataSource {

    grid;
    dataSourceConfig;
    getAllUrl;
    getPageUrl;
    insertUrl;
    updateUrl;
    tableName;
    rowCount;
    sortFieldName;
    sortOrder;
    minValue;
    maxValue;
    cacheSize;
    tableData;
    direction;

    constructor(dataSourceConfig, grid) {

        this.grid = grid;
        this.grid.dataSource = this;
        this.dataSourceConfig = dataSourceConfig;
        this.rowCount = dataSourceConfig.rowCount;
        this.getAllUrl = dataSourceConfig.getAllUrl;
        this.updateUrl = dataSourceConfig.updateUrl;
        this.tableName = dataSourceConfig.tableName;
        this.getPageUrl = dataSourceConfig.getPageUrl;
        this.insertUrl = dataSourceConfig.insertUrl;
        this.cacheSize = dataSourceConfig.cacheSize;
        this.grid.getSortData();

        this.loadStartData();
    }

    setExtremes() {
        this.minValue = this.tableData[0][this.sortFieldName];
        this.maxValue = this.tableData[this.tableData.length - 1][this.sortFieldName];
    }

    start(data) {
        this.tableData = data[this.tableName];
        var i;
        for (i = 0; i < this.tableData.length; i++) {
            this.tableData[i].owner = this;
        }
        this.setExtremes();
        this.grid.build();
    }


    reload() {

        this.tableData.sort(this.compare);
        this.setExtremes();
        this.grid.build();
    }

    loadAll() {
        $.when(
            $.ajax({
                url: this.getAllUrl,
                context: this
            })).then(this.start);
    }


    prepareSelectParams(direction, count) {

        var value;

        if ((this.sortOrder == 1) && (direction == "DOWN")
            || ((this.sortOrder == -1) && (direction == "UP"))) {
            value = this.maxValue;
        } else {
            value = this.minValue;
        }
        var sortOrderStr;
        if (this.sortOrder = 1) {
            sortOrderStr = "ASC";
        } else {
            sortOrderStr = "DESC";
        }
        let params = new SelectParams(direction, count, this.sortFieldName, value, sortOrderStr);
        return JSON.stringify(params);
    }


    loadStartData() {

        let count = this.rowCount;
        this.minValue = "";
        this.maxValue = "";
        this.rowCount = this.cacheSize;
        this.direction = "DOWN";
        let params = this.prepareSelectParams(this.direction, this.rowCount, this.sortFieldName, this.sortOrder);
        this.rowCount = count;
        $.when(
            $.ajax({
                url: this.getPageUrl,
                type: "POST",
                contentType: "application/json",
                context: this,
                data: params,
                error: this.checkStatus
            })
        ).then(this.start);

    }

    loadPage(data, status, xhr) {

        var n;

        if (data != undefined) {

            let buffor = data[this.tableName];
            n = buffor.length;
            var i;
            for (i = 0; i < n; i++) {
                buffor[i].owner = this;
            }
            if (n > 0) {
                if (this.direction == "DOWN") {

                    this.tableData = this.tableData.slice(n);
                    this.tableData = this.tableData.concat(buffor);

                } else {
                    this.tableData = buffor.concat(this.tableData);
                    this.tableData.length = this.tableData.length - n;
                }
            }
            this.setExtremes();
            n = n * this.sortOrder;
        } else {
            n = 0;
        }
        this.grid.engine.scrollN(n);
    }

    getPage(direction, count) {

        this.rowCount = count;
        this.direction = direction;
        let params = this.prepareSelectParams(direction, count);

        $.ajax({
            url: this.getPageUrl,
            type: "POST",
            context: this,
            contentType: "application/json",
            data: params,
            error: this.checkStatus,
            success: this.loadPage
        });
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

        if (i < this.tableData.length) {
            return this.tableData[i];
        } else {
            return null;
        }
    }

    loadNew(data) {
        return data;
    }

    insertData(data) {

        $.ajax({
            url: this.insertUrl,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(data),
            error: this.checkStatus,
            success: this.loadNew()
        });

    }


    checkStatus(xhr) {
        alert("Error " + xhr.status + "\nStatus: " + xhr.statusText);
    }

    compare(a, b) {

        let col = a.owner.sortFieldName;
        let sortOrder = a.owner.sortOrder;

        if (isNaN(a[col])) {
            if (a[col] > b[col]) {
                return sortOrder;
            } else {
                return -sortOrder;
            }
        } else return (a[col] - b[col]) * sortOrder;

    }
}