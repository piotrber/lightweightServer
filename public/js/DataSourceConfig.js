class DataSourceConfig {

    getAllUrl;
    getPageUrl;
    insertUrl;
    updateUrl;
    deleteUrl;
    rowCount;
    cacheSize;


    constructor(tableName, rowCount, cacheSize, rootUrl, getAllUrl, updateUrl, getPageUrl, insertUrl, deleteUrl) {
        this.tableName = tableName;
        this.rowCount = rowCount;
        this.cacheSize = cacheSize;
        this.rootUrl = rootUrl;
        this.getAllUrl = this.rootUrl + getAllUrl;
        this.getPageUrl = this.rootUrl + getPageUrl;
        this.insertUrl = this.rootUrl + insertUrl;
        this.updateUrl = this.rootUrl + updateUrl;
        this.deleteUrl = this.rootUrl + deleteUrl;
    }
}

class SelectParams {
    direction;
    count;
    column;
    value;
    sortOrder;

    constructor(direction, count, column, value, sortorder) {
        this.direction = direction;
        this.count = count;
        this.column = column;
        this.value = value;
        this.sortOrder = sortorder;
    }
}

