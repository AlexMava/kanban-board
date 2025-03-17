const Express = require('express');
const Mongoclient = require('mongodb').MongoClient;
const cors = require('cors');
const multer = require('multer');

const app=Express();

app.use(cors());
app.use(Express.json())
app.use(Express.urlencoded({ extended: true }))

const PORT = process.env.PORT,
    MONGOCLUSTER = process.env.MONGOCLUSTER,
    DATABASENAME = process.env.DATABASENAME,
    DBUSERNAME = process.env.DBUSERNAME,
    DBPASSWORD = process.env.DBPASSWORD;

const CONNECTIN_STRING = `mongodb+srv://${DBUSERNAME}:${DBPASSWORD}@${MONGOCLUSTER}.t6iju.mongodb.net/?retryWrites=true&w=majority&appName=${MONGOCLUSTER}`;

let database;

async function connectToMongoDB() {
    const client = new Mongoclient(CONNECTIN_STRING, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    database = client.db(DATABASENAME);
    console.log('Connected to MongoDB');
}
connectToMongoDB().catch(console.error);
app.listen(PORT, '0.0.0.0' , () => {
    console.log(`The server is running on port ${PORT}`);
})

app.get('/api/kanbanboard/get-repo/:name', (request, response) => {
    async function run() {
        try {
            const repos = database.collection("repos");
            const query = {name: request.params.name};

            const repo = await repos.findOne(query);
            response.json(repo).status(200);
        } catch (err) {
            response.send(err).status(500);
        }
    }

    run().catch(console.dir);
})
app.post('/api/kanbanboard/AddRepo', multer().none(), (request, response) => {
    function addRepo (item) {
        if (!item) {
            database.collection('repos').insertOne(request.body);
            response.json(`Item has been created successfully!!`).status(200);
        } else {
            response.json(`Item has has not been created!`).status(404);
        }
    }

    try {
        database.collection('repos').findOne({
            id: request.body.id
        }).then((item) => { addRepo(item) })

    } catch (err) {
        response.send(err).status(500);
    }
})

app.post('/api/kanbanboard/UpdateRepo', multer().none(), (request, response) => {
    function updateRepo (item) {
        if (item) {
            database.collection('repos').updateOne({id: request.body.id}, {$set: request.body});
            response.json(`Item has been updated successfully!`).status(200);
        } else {
            response.json(`Item has not been updated!`).status(404);
        }
    }

    try {
        database.collection('repos').findOne({
            id: request.body.id
        }).then((item) => { updateRepo(item) })

    } catch (err) {
        response.send(err).status(500);
    }
})