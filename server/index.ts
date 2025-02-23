var Express = require('express');
var Mongoclient = require('mongodb').MongoClient;
var cors = require('cors');
const multer = require('multer');

var app=Express();
app.use(cors());
app.use(Express.json())
app.use(Express.urlencoded({ extended: true }))

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
        console.log(`The server is running on port ${PORT}`);
    })
})

app.get('/api/kanbanboard/GetRepos', (request, response) => {
    database.collection('repos').find({}).toArray((error, result) =>{
        response.send(result);
    });
});

app.get('/api/kanbanboard/get-repo', (request, response) => {
    async function run() {
        try {
            const repos = database.collection("repos");
            const query = {name: request.query.name};

            const repo = await repos.findOne(query);
            response.json(repo);
        } catch {
            console.log('Error by getting the repo')
        }
    }

    run().catch(console.dir);
})
app.post('/api/kanbanboard/AddRepo', multer().none(), (request, response) => {
    function addRepo (item) {
        if (!item) {
            database.collection('repos').insertOne(request.body);
            response.json(`Item has been created successfully!!`);
        } else {
            response.json(`Item has has not been created!`);
        }
    }

    try {
        database.collection('repos').findOne({
            id: request.body.id
        }).then((item) => { addRepo(item) })

    } catch (e) {
        console.log('Error, something went wrong: Item has not been saved to the DB!', e)
    }
})

app.post('/api/kanbanboard/UpdateRepo', multer().none(), (request, response) => {
    function updateRepo (item) {
        if (item) {
            database.collection('repos').updateOne({id: request.body.id}, {$set: request.body});
            response.json(`Item has been updated successfully!`);
        } else {
            response.json(`Item has not been updated!`);
        }
    }

    try {
        database.collection('repos').findOne({
            id: request.body.id
        }).then((item) => { updateRepo(item) })

    } catch (e) {
        console.log('Error, something went wrong: Item has not been saved to the DB!', e)
    }
})

app.delete('/api/kanbanboard/DeleteRepo', (request, response) => {
    database.collection('repos').deleteOne({
        id: request.query.id
    });
    response.json('Item has been deleted!')
})