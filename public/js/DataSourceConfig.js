class DataSourceConfig {

    getAllUrl;
    getNextUrl;
    getPrevUrl;
    insertUrl;
    updateUrl;
    deleteUrl;
    sortByColumnName;



    constructor(tableName, rootUrl, getAllUrl, updateUrl, getNextPgUrl, getPrevPgUrl, insertUrl,  deleteUrl, sortByColumnName) {
        this.tableName = tableName;
        this.rootUrl= rootUrl;
        this.getAllUrl = this.rootUrl+getAllUrl;
        this.getNextUrl =  this.rootUrl+ getNextPgUrl;
        this.getPrevUrl = this.rootUrl+getPrevPgUrl;
        this.insertUrl = this.rootUrl+insertUrl;
        this.updateUrl = this.rootUrl+updateUrl;
        this.deleteUrl = this.rootUrl+deleteUrl;
        this.sortByColumnName = sortByColumnName;
    }
}

