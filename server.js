// Module

let express = require('express');
let bodyparser = require('body-parser');
let url = require('url');
let session = require('express-session')
let validator = require('express-validator')

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

// app.use(validator());

app.use(session({ secret: "nathan", saveUninitialized: false, resave: false }));

// Route

app.get('/', async (req, res) => {


    const queryObject = url.parse(req.url, true).query;

    if (queryObject.del != undefined) {
        console.log(queryObject.del)

        await modelDatabase.delete(queryObject.del)
        
    }
    
    let data = undefined
    let userInfo = undefined

    if(req.session.infoFromDB) {
        req.session.infoFromDB = await modelDatabase.searchUserTodoList(req.session.infoFromDB[0])
        data = req.session.infoFromDB[1]
        userInfo = req.session.infoFromDB[0]
    }

    res.render('web/index', { data ,userInfo })
});

app.post('/', async (req, res) => {

    req.session.infoFromDB = await modelDatabase.connectionOfTheUser(req.body)

    let userInfo = req.session.infoFromDB[0]
    let data = req.session.infoFromDB[1]

    console.log(userInfo);
    console.log(data);

    res.render('web/index', { userInfo,data })
});

app.get('/disconnect', (req, res) => {

    req.session.destroy(function (err) {
        console.log(err)
    })
    res.render('web/index')
});


app.listen(8080);





