const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
const uri = 'mongodb+srv://onion:U3qCqoWdXF2pXZno@cluster0.gzkpw83.mongodb.net/?retryWrites=true&w=majority';
console.log(uri);

// const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const menuCollection = client.db('onion').collection('onioncollection');
    
    app.get('/meals', async (req, res) => {
      try {
        const result = await menuCollection.find().toArray();
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
    });

    app.get('/meals/:category', async (req, res) => {
        try {
          const { category } = req.params;
          const result = await menuCollection.find({ category }).toArray();
          res.send(result);
        } catch (error) {
          console.error(error);
          res.status(500).send('Internal Server Error');
        }
      });

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error(error);
  }
}

run().catch(console.dir);

app.get('/', async (req, res) => {
  res.send('red-onion server is running');
});

app.listen(port, () => console.log(`red-onion server listening on port ${port}`));
