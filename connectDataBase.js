class model {

    constructor() {
        this.CryptoJS = require("crypto-js");
        this.MongoClient = require("mongodb").MongoClient;
        this.uri = require("./uri")
        this.client = new this.MongoClient(this.uri,{ useUnifiedTopology: true });
    }

    async run() {
        await this.client.connect();
    }

    connectionToCollection(nameOfTheCollection){
        const client = this.client;
        const database = client.db("todolist");
        return database.collection(nameOfTheCollection);
    }

    async create(todo, userInfo) {
        const client = this.client;
        const database = client.db("todolist");
        const collectionTodo = database.collection("todolists");

        const numberOfTodo = await collectionTodo.countDocuments({ user_id: userInfo.user_id });
        const documentToInsert = { user_id: userInfo.user_id, todo_id: numberOfTodo, text: todo, done: false }
        await collectionTodo.insertOne(documentToInsert);
    }

    async registration(username, cryptedPassword) {
        
        console.log("Je suis invoqué")
        const collectionUsers = this.connectionToCollection("users")
        if (await collectionUsers.countDocuments({ username: username })) {
            return false;
        } else {
            const numberOfUsers = await collectionUsers.countDocuments();
            const documentToInsert = { user_id: numberOfUsers, username: username, psswrd: cryptedPassword }
            await collectionUsers.insertOne(documentToInsert);
            return true;
        }

    }

    async delete(idOfTheTodo, userInfo) {

        const collectionTodo = this.connectionToCollection("todolists")

        const updateDoc = {
            $set: {
                done: true,
            },
        };

        await collectionTodo.updateOne({ user_id: userInfo.user_id, todo_id: parseInt(idOfTheTodo) }, updateDoc, { upsert: true });

    }

    async searchUserTodoList(userInfoInDataBase) {

        const collectionTodo = this.connectionToCollection("todolists")

        let userTodolistsInDataBase = await collectionTodo.find({ user_id: userInfoInDataBase.user_id });

        let dataToSend = []

        await userTodolistsInDataBase.forEach(function (myDoc) {

            dataToSend.push({ todo_id: myDoc.todo_id, text: myDoc.text, done: myDoc.done });

        });

        return [{ username: userInfoInDataBase.username, user_id: userInfoInDataBase.user_id }, dataToSend];
    }

    async connectionOfTheUser(infosEnteredByUser) {

        try {

            const collectionUsers = this.connectionToCollection("users")

            const query = { username: infosEnteredByUser.username };

            const options = {
                sort: { rating: -1 },
                projection: { _id: 0, username: 1, psswrd: 1, user_id: 1 },
            };

            const userInfoInDataBase = await collectionUsers.findOne(query, options);

            let bytes = this.CryptoJS.AES.decrypt(userInfoInDataBase.psswrd, 'todolist');

            let originalText = bytes.toString(this.CryptoJS.enc.Utf8);

            if (infosEnteredByUser.psswrd == originalText) {

                return this.searchUserTodoList(userInfoInDataBase)

            } else {
                return false
            }

        } catch (e) {

            console.error(e);

        }

    }
}

module.exports = model;