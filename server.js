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
    res.render('Web/index', { test: 'Salut' })
})

app.post('/', (request, response) => {
    if (request.body.message === undefined || request.body.message === '') {

        response.redirect('/')

    } else {

    }
})

app.listen(3000);

// let dataBase = [{id:0,todo:'Nourrir le chat',done:false}]