// Module
let aws = require('aws-sdk');
let bodyparser = require('body-parser');
let url = require('url');
let express = require('express');
let session = require('express-session')
let app = express()

app.set('view engine', 'ejs')

// DataBase

let s3 = new aws.S3({
    accessKeyId: process.env.S3_KEY ,
    secretAccessKey: process.env.S3_SECRET
});


modelDatabaseImport = require('./connectDataBase.js');

modelDatabase = new modelDatabaseImport();

modelDatabase.run(s3.config.accessKeyId)

// Middleware

app.use(express.static('public'));

app.use(bodyparser.urlencoded({ extended: false }));

app.use(bodyparser.json());

app.use(session({ secret: "nathan", saveUninitialized: false, resave: false }));

// Route

app.get('/', async (req, res) => {

    const queryObject = url.parse(req.url, true).query;

    let data = undefined
    let userInfo = undefined

    if (req.session.infoFromDB) {

        if (queryObject.del != undefined) {
            await modelDatabase.delete(queryObject.del, req.session.infoFromDB[0])
        } else if (queryObject.add != undefined) {
            await modelDatabase.create(queryObject.add, req.session.infoFromDB[0])
        }

        req.session.infoFromDB = await modelDatabase.searchUserTodoList(req.session.infoFromDB[0])
        data = req.session.infoFromDB[1]
        userInfo = req.session.infoFromDB[0]
    }

    res.render('web/index', { data, userInfo })
});

app.post('/', async (req, res) => {

    req.session.infoFromDB = await modelDatabase.connectionOfTheUser(req.body)

    let userInfo = req.session.infoFromDB[0]
    let data = req.session.infoFromDB[1]

    res.render('web/index', { userInfo, data })
});

app.get('/disconnect', (req, res) => {

    req.session.destroy(function (err) {
        console.log(err)
    })
    res.render('web/index')
});

app.listen(process.env.PORT || 8080);





