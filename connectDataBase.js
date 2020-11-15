class model {

    constructor() {

        this.MongoClient = require("mongodb").MongoClient;
        this.uri = require('./uri.js');
        this.client = new this.MongoClient(this.uri);
    }

    async run() {
        const client = this.client;
        await client.connect();

        console.log("Connexion à la database réussie !")
    }

    async create() { }

    async delete() { }

    async read() { }

    async connectionOfTheUser(infosEnteredByUser) {

        try {

            const client = this.client;

            const database = client.db("todolist");
            const collectionUser = database.collection("users");
            const collectionTodo = database.collection("todolists");

            const query = { username: infosEnteredByUser.username };


            const options = {
                sort: { rating: -1 },
                projection: { _id: 0, username: 1, psswrd: 1, user_id:1 },
            };

            const userInfoInDataBase = await collectionUser.findOne(query, options);
            

            if(infosEnteredByUser.psswrd == userInfoInDataBase.psswrd) {
                console.log("ça correspond !")

                const userTodolistsInDataBase = await collectionTodo.findOne(query, options);
                
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