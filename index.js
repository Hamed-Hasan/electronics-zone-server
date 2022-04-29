const express = require('express');
const cors = require('cors');
var jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jxqey.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log('db connect');

async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('electronics').collection('service');
        const orderCollection = client.db('electronics').collection('order');

    //   show display service
     app.get('/service', async (req, res) => {
         const query = {};
         const cursor = serviceCollection.find(query);
         const result = await cursor.toArray()
         res.send(result);
     })

     app.get('/service/:id', async (req, res) => {
        const id = req.params.id;
        const query={_id: ObjectId(id)}
        const service = await serviceCollection.findOne(query);
        res.send(service);
    })


    app.delete('/service/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)}
        const result = await serviceCollection.deleteOne(query);
        res.send(result);
    })


    app.post('/service', async (req, res) =>{
        const newService = req.body;
        const result = await serviceCollection.insertOne(newService);
        res.send(result);
    })
    
    }
    finally {

    }
}

run().catch(console.dir);

app.get('/test', (req, res) => {
    res.send('Running heroku Server');
});
app.get('/', (req, res) => {
    res.send('Running assignment Server');
});

app.listen(port, () => {
    console.log('Listening to port', port);
})

