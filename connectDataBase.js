class model {

    constructor() {

        this.MongoClient = require("mongodb").MongoClient;
        this.uri = require('./uri.js');
        this.client = new this.MongoClient(this.uri);
    }

    async run() {
        const client = this.client
        await client.connect();

        console.log("Connexion réussi !")
    }

    async create() { }

    async delete() { }

    async read() { }

    async connectionOfTheUser(infosEnteredByUser) {


        

        try {

            const client = this.client

            const database = client.db("todolist");
            const collection = database.collection("users");

            const query = { username: infosEnteredByUser.username };


            const options = {
                sort: { rating: -1 },
                projection: { _id: 0, username: 1, psswrd: 1 },
            };

            const userInfoInDataBase = await collection.findOne(query, options);

            if(infosEnteredByUser.psswrd == userInfoInDataBase.psswrd) {
                console.log("ça correspond !")
                return userInfoInDataBase
            } else {
                console.log("ça correspond pas !!!")
            }

            

        } catch (e) {

            console.error(e);

        } 

    }
}

module.exports = model;