// DataBase //

let dataBase = [{ id: 0, todo: 'Nourrir le chat', done: false },
                { id: 1, todo: 'Manger une banane', done: false },
                { id: 2, todo: 'Nettoyer la litière', done: false },
                { id: 3, todo: 'Faire à manger', done: false }]

// Module

let express = require('express');
let bodyparser = require('body-parser');
let session = require('express-session')

let app = express()

app.set('view engine', 'ejs')

// Middleware

app.use(express.static('public'));

app.use(bodyparser.urlencoded({ extended: false }));

app.use(bodyparser.json());

// Route

app.get('/', (req, res) => {
    res.render('Web/index', { dataBase })
})

app.post('/', (req, res) => {
    dataBase.push({id:dataBase.length,todo:req.body.message,done:false})
})

app.listen(3000);



