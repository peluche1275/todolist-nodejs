let http = require('http');
let server = http.createServer();

let dataBase = [{id:0,todo:'Nourrir le chat',done:false}]

server.on('request',function(req,res){
    res.end("Todo List");
});

server.listen(3000);