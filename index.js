const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());
require('dotenv').config()




const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.enmmk.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const products = client.db("emaJohnStore").collection("products");
    const orders = client.db("emaJohnStore").collection("orders");


    app.post('/addProduct', (req, res) => {
        const allProduct = req.body
        products.insertOne(allProduct)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount)
            })
    });



    app.get('/products', (req, res) => {
        products.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.get('/product/:key', (req, res) => {
        products.find({ key: req.params.key })
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    })

    app.post('/productsByKeys', (req, res) => {
        const productKeys = req.body;
        products.find({ key: { $in: productKeys } })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        orders.insertOne(order)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

});


app.get('/', (req, res) => {
    res.send('Hello from server')
})

app.listen(4000);