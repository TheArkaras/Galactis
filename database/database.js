const PouchDB = require('pouchdb');

class database {
    constructor(databaseName) {
        this.db = new PouchDB(databaseName);
    }
    put(documentObject) {
        let jsonstring = JSON.stringify(documentObject);
        console.log(`Putting json in db of ${jsonstring}`);
        return this.db.put(JSON.parse(jsonstring))
        .catch((error) => {
            console.log(`Database threw error ${error}`);
            throw error;
        });
    }
    get(documentName) {
        return this.db.get(documentName).then(data => {
            console.log(`got json from server ${JSON.stringify(data)}`)
            return data;
        });
    }
    remove(documentName)
    {
        return this.get(documentName).then((document) =>
        {
            return this.db.remove(document);
        });
    }

}
module.exports = database;
