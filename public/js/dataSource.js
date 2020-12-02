class DataSource {

    constructor(getUri, getNextUri, getPrevUri, insertUri, updateUri, deleteUri, sortByColumnName) {
        this.getUri = getUri;
        this.getNextUri = getNextUri;
        this.getPrevUri = getPrevUri;
        this.insertPath = insertUri;
        this.updateUri = updateUri;
        this.deleteUri = deleteUri;
        this.sortByColumnName = sortByColumnName;
    }

    currentId = 0;
    minValue;
    maxValue;


    getRow(id){
        return this.loadRowData(id,this.getUri)
    }


    getPrevRow(value){

        let data =  this.loadRowData(value,this.getPrevUri)
        if (data[this.sortByColumnName] < this.minValue) {
            this.minValue = data[this.sortByColumnName]
        }
    }

    getNextRow(value){

        let data = this.loadRowData(value,this.getNextUri)
        if (data[this.sortByColumnName] > this.maxValue) {
            this.maxValue = data[this.sortByColumnName]
        }
        return data
    }


    loadRowData(value,getUri) {
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
            $.get(getUri + "?" + value + "&" + this.sortByColumnName, recive)
        }
        return dataObject;
    }

}