class model {

    constructor() {

        this.MongoClient = require("mongodb").MongoClient;
        this.uri = require("./uri")
        this.client = new this.MongoClient(this.uri);
    }

    async run() {
        const client = this.client;
        await client.connect();

        console.log("Connexion à la database réussie !")
    }

    async create(todo, userInfo) {
        const client = this.client;
        const database = client.db("todolist");
        const collectionTodo = database.collection("todolists");

        const numberOfTodo = await collectionTodo.countDocuments({ user_id: userInfo.user_id });
        const documentToInsert = { user_id: userInfo.user_id, todo_id: numberOfTodo, text: todo, done: false }
        await collectionTodo.insertOne(documentToInsert);
    }

    async delete(idOfTheTodo, userInfo) {
        const client = this.client;
        const database = client.db("todolist");
        const collectionTodo = database.collection("todolists");

        const updateDoc = {
            $set: {
                done: true,
            },
        };

        await collectionTodo.updateOne({ user_id: userInfo.user_id, todo_id: parseInt(idOfTheTodo) }, updateDoc, { upsert: true });

    }


    async searchUserTodoList(userInfoInDataBase) {
        const client = this.client;
        const database = client.db("todolist");
        const collectionTodo = database.collection("todolists");

        let userTodolistsInDataBase = await collectionTodo.find({ user_id: userInfoInDataBase.user_id });

        let dataToSend = []

        await userTodolistsInDataBase.forEach(function (myDoc) {


            dataToSend.push({ todo_id: myDoc.todo_id, text: myDoc.text, done: myDoc.done });


        });

        return [{ username: userInfoInDataBase.username, user_id: userInfoInDataBase.user_id }, dataToSend];
    }

    async connectionOfTheUser(infosEnteredByUser) {

        try {

            const client = this.client;

            const database = client.db("todolist");
            const collectionUser = database.collection("users");


            const query = { username: infosEnteredByUser.username };


            const options = {
                sort: { rating: -1 },
                projection: { _id: 0, username: 1, psswrd: 1, user_id: 1 },
            };

            const userInfoInDataBase = await collectionUser.findOne(query, options);


            if (infosEnteredByUser.psswrd == userInfoInDataBase.psswrd) {

                return this.searchUserTodoList(userInfoInDataBase)


            }

        } catch (e) {

            console.error(e);

        }

    }
}

module.exports = model;