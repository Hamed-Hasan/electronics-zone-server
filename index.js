const express = require('express');
const cors = require('cors');
var jwt = require('jsonwebtoken');
const {
    MongoClient,
    ServerApiVersion,
    ObjectId
} = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jxqey.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
});

// jwt verify
function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({
            message: 'unauthorized access'
        })
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({
                message: ' access'
            })
        }
        req.decoded = decoded;
        next();
    })
}

async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('electronics').collection('service');
        const addItemCollection = client.db('electronics').collection('order');

        // Generate token when user login
        app.post('/login', async (req, res) => {
            const email = req.body
            const token = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET)
            res.send({
                token
            })
        })

        //   show display service
        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const result = await cursor.toArray()
            res.send(result);
        })

        // find single service
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: ObjectId(id)
            }
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        // delete from single service
        app.delete('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: ObjectId(id)
            }
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        })

            // delete from manage item
        app.delete('/manage/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: ObjectId(id)
            }
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        })

        // delete from single Item MyItem page
        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: ObjectId(id)
            }
            const result = await addItemCollection.deleteOne(query);
            res.send(result);
        })

        // Create user
        app.post('/service', async (req, res) => {
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result);
        })

        // create user
        app.post('/addItem', async (req, res) => {
            const order = req.body
            const result = await addItemCollection.insertOne(order);
            res.send(result);
        })

            // show display item
        app.get('/item', verifyJWT, async (req, res) => {
            const freedomEmail = req.decoded.email;
            const email = req.query.email;
            if (email === freedomEmail) {
                const query = {
                    email: email
                }
                const cursor = addItemCollection.find(query)
                const order = await cursor.toArray()
                res.send(order)
            } else {
                res.status(404).send({
                    message: 'not allowed access'
                })
            }
        })


        // update item manage pages
        app.put("/update/:id", async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            console.log("from update api", data);
            const filter = {
                _id: ObjectId(id)
            };
            const options = {
                upsert: true
            };

            const updateDoc = {
                $set: {
                    name: data.name,
                    email: data.email,
                    img: data.img,
                    supplier: data.supplier,
                    price: data.price,
                },
            };
            const result = await serviceCollection.updateOne(
                filter,
                updateDoc,
                options
            );
            res.send(result);
        });





    } finally {

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