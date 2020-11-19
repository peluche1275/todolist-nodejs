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

app.use(session({secret:"nathan",saveUninitialized:false,resave:false}));

// Route

app.get('/', (req, res) => {
    let data = req.session.data
    res.render('web/index', { data })
})
 
app.post('/', async (req, res) => {
    req.session.data = await modelDatabase.connectionOfTheUser(req.body)
    let data = req.session.data
    
    
    res.render('web/index', { data } )
})

app.listen(8080);





