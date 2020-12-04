class DataSourceConfig {

    getAllUri;
    getNextUri;
    getPrevUri;
    insertUri;
    updateUri;
    deleteUri;
    sortByColumnName;



    constructor(getAllUri, getNextUri, getPrevUri, insertUri, updateUri, deleteUri, sortByColumnName) {
        this.getAllUri = getAllUri;
        this.getNextUri = getNextUri;
        this.getPrevUri = getPrevUri;
        this.insertUri = insertUri;
        this.updateUri = updateUri;
        this.deleteUri = deleteUri;
        this.sortByColumnName = sortByColumnName;
    }
}

