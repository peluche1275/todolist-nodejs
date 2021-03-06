// Module
let CryptoJS = require("crypto-js");
let bodyparser = require('body-parser');
let url = require('url');
let express = require('express');
let session = require('express-session');
let app = express();

app.set('view engine', 'ejs');

// DataBase

modelDatabaseImport = require('./connectDataBase.js');

modelDatabase = new modelDatabaseImport();

modelDatabase.run();

// Middleware

app.use(express.static('public'));

app.use(bodyparser.urlencoded({ extended: false }));

app.use(bodyparser.json());

app.use(session({ secret: "nathan", saveUninitialized: false, resave: false }));

// Route

app.get('/', async (req, res) => {

    const queryObject = url.parse(req.url, true).query;

    let data = undefined;
    let userInfo = undefined;

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

    res.render('web/index', { data, userInfo });
});

app.post('/', async (req, res) => {

    req.session.infoFromDB = await modelDatabase.connectionOfTheUser(req.body)

    if(req.session.infoFromDB) {
        let userInfo = req.session.infoFromDB[0];
        let data = req.session.infoFromDB[1];
    
        res.render('web/index', { userInfo, data })
    } else {
        let data = undefined;
        let userInfo = undefined;
        let error = "Mots de passe ou nom d'utilisateur incorrect !";
        res.render('web/index', { userInfo, data,error });
    }

});

app.get('/disconnect', (req, res) => {

    req.session.destroy(function (err) {
        if(err) {
            console.log(err);
        }
    })
    res.render('web/index');
});

app.get('/inscription', (req, res) => {

    if (req.session.infoFromDB) {
        let userInfo = req.session.infoFromDB[0]
        let data = req.session.infoFromDB[1]
        res.render('web/index', { userInfo, data })
    } else {
        let error = undefined;
        res.render('web/register',{ error } );
    }

});

app.post('/inscription', async (req, res) => {

    if (req.body.psswrd == req.body.psswrdVerify) {
        let username = req.body.username;
        let cryptedPassword = CryptoJS.AES.encrypt(req.body.psswrd, 'todolist').toString();
        if (await modelDatabase.registration(username, cryptedPassword)) {
            res.render('web/index');
        } else {
            let error = "Ce pseudonyme existe déjà !";
            res.render('web/register',{ error });
        }
    } else {
        let error = "Les mots de passe sont différents !";
        res.render('web/register',{ error });
    }
});

app.listen(process.env.PORT || 8080);





