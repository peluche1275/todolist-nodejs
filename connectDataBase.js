function LauchConnectionToDataBase() {
    const { MongoClient } = require('mongodb');

    async function listDatabases(client) {
        databasesList = await client.db().admin().listDatabases();

        console.log("Databases:");
        databasesList.databases.forEach(db => console.log(` - ${db.name}`));
    };

    async function main() {

        const uri = require('./uri.js');
        const client = new MongoClient(uri);

        try {

            await client.connect();

            const database = client.db("todolist");
            const collection = database.collection("users");

            const query = { user_id: 0 };

            const options = {
                sort: { rating: -1 },
                projection: { _id: 0, username: 1},
              };

            const thename = await collection.findOne(query, options);

            console.log(thename.username);

        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }

    main().catch(console.error);

}

module.exports = LauchConnectionToDataBase();