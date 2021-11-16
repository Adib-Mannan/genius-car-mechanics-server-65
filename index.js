const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3uvbd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db("carMechanic");
        const dataCollection = database.collection("services");
        // create a document to insert

        //GET API
        app.get('/services', async (req, res) => {
            const cursor = dataCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        // GET A SINGLE API 

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await dataCollection.findOne(query);
            res.send(service);
        })

        // POST API
        app.post('/services', async (req, res) => {
            const services = req.body;
            const result = await dataCollection.insertOne(services);
            res.json(result)
        });
        // DELETE API  
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await dataCollection.deleteOne(query);
            res.json(result)
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});