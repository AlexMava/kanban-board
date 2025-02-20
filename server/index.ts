var Express = require('express');
var Mongoclient = require('mongodb').MongoClient;
var cors = require('cors');
const multer = require('multer');

var app=Express();
app.use(cors());

const PORT = process.env.PORT,
    MONGOCLUSTER = process.env.MONGOCLUSTER,
    DATABASENAME = process.env.DATABASENAME,
    DBUSERNAME = process.env.DBUSERNAME,
    DBPASSWORD = process.env.DBPASSWORD;

var CONNECTIN_STRING = `mongodb+srv://${DBUSERNAME}:${DBPASSWORD}@${MONGOCLUSTER}.t6iju.mongodb.net/?retryWrites=true&w=majority&appName=${MONGOCLUSTER}`;

var database;
app.listen(PORT, () => {
    Mongoclient.connect(CONNECTIN_STRING, (error, client) => {
       database = client.db(DATABASENAME);
        console.log('connected to the DB');
    })
})

app.get('/api/kanbanboard/GetRepos', (request, response) => {
    database.collection('repos').find({}).toArray((error, result) =>{
        response.send(result);
    });
});

app.get('/api/kanbanboard/GetOneRepo', (request, response) => {
    database.collection('repos').findOne({
        id: request.body.id
    })
        .then(function (doc) {
            if(!doc) console.log('No record found.');
        })
});
app.post('/api/kanbanboard/AddRepo', multer().none(), (request, response) =>{
    database.collection('repos').count({}, function (error, numOfDocs) {
        database.collection('repos').insertOne({
            id: (numOfDocs + 1).toString(),
            content: request.body.newRepo
        });
        response.json('Added Successfully!');
    })
})

app.delete('/api/kanbanboard/DeleteRepo', (request, response) => {
    database.collection('repos').deleteOne({
        id: request.query.id
    });
    response.json('Item has been deleted!')
})