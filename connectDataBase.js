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

            await listDatabases(client);

        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }

    main().catch(console.error);

}

module.exports = LauchConnectionToDataBase();