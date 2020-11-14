class model {

    constructor() {

        this.MongoClient = require("mongodb").MongoClient;
        this.uri = require('./uri.js');
        this.client = new this.MongoClient(this.uri);
    }

    async create() { }

    async delete() { }

    async read() { }

    async test(collection) {

        const query = { user_id: 0 };

        const options = {
            sort: { rating: -1 },
            projection: { _id: 0, username: 1 },
        };

        const thename = await collection.findOne(query, options);

        console.log(thename.username);
    }

    async run(methodToApply) {

        const client = this.client

        try {

            await client.connect();

            const database = client.db("todolist");
            const collection = database.collection("users");

            eval("this." + methodToApply + "(collection)")

        } catch (e) {

            console.error(e);

        } finally {

            await client.close();
            
        }

    }
}

module.exports = model;