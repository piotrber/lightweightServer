class DataSourceConfig {

    getAllUrl;
    getPageUrl;
    insertUrl;
    updateUrl;
    deleteUrl;
    rowCount;


    constructor(tableName, rowCount, rootUrl, getAllUrl, updateUrl, getPageUrl, insertUrl, deleteUrl) {
        this.tableName = tableName;
        this.rowCount = rowCount;
        this.rootUrl = rootUrl;
        this.getAllUrl = this.rootUrl + getAllUrl;
        this.getPageUrl = this.rootUrl + getPageUrl;
        this.insertUrl = this.rootUrl + insertUrl;
        this.updateUrl = this.rootUrl + updateUrl;
        this.deleteUrl = this.rootUrl + deleteUrl;
    }
}

class SelectParams {
    count;
    column;
    value;
    sortOrder;

    constructor(count, column, value, sortorder) {
        this.count = count;
        this.column = column;
        this.value = value;
        this.sortOrder = sortorder;
    }
}

