
// Module

let express = require('express');
let bodyparser = require('body-parser');
let url = require('url');


let session = require('express-session')

let app = express()

app.set('view engine', 'ejs')

// DataBase

modelDatabaseImport = require('./connectDataBase.js');

modelDatabase = new modelDatabaseImport();

modelDatabase.run()

// Middleware

app.use(express.static('public'));

app.use(bodyparser.urlencoded({ extended: false }));

app.use(bodyparser.json());

// Route

app.get('/', (req, res) => {
    res.render('web/index')
})
 
app.post('/', async (req, res) => {
    let data = await modelDatabase.connectionOfTheUser(req.body)

    if(data){
        console.log("y'a d'la data")
        console.log(data)
    }

    res.render('web/index', { data } )
})

app.listen(8080);



// const queryObject = url.parse(req.url, true).query;

//     if (queryObject.del != undefined) {
//         let dataBaseIndexById = dataBase.findIndex(x => x.id == queryObject.del);
//         dataBase[dataBaseIndexById].done = true;
//     }



