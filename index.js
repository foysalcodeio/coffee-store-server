const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


//MIDDLEWARE
app.use(cors())
app.use(express.json())


// database user name and password test
// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASS)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1vlp1px.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    //create DB
    const coffeeCollection = client.db('coffeeDB').collection('coffee')
    // create DB for authentication
    const userCollection = client.db('coffeeDB').collection('user')


   // ============================== CRUD ACTION HERE =======================

    // 1. CREATE
    app.post('/coffee', async(req, res) =>{
      const newCoffee = req.body;
      console.log(newCoffee);
      // data post in DB
      const result = await coffeeCollection.insertOne(newCoffee)
      res.send(result)
    })
    

    // 2. READ - data dekha
    app.get('/coffee', async(req, res) =>{
       const cursor = coffeeCollection.find();
       const result = await cursor.toArray();
       res.send(result)
    })


    // 3. DELETE
    app.delete('/coffee/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);      
    })

    //4. 1. UPDATE
    app.get('/coffee/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    })

    app.get('/coffeeDetails/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    })

    // 4. 2. UPDATE

    app.put('/coffee/:id', async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true};
      const updatedCoffee = req.body;
      const coffee = {
        $set:{
          name: updatedCoffee.name,
          quantity: updatedCoffee.quantity,
          supplier: updatedCoffee.supplier,
          taste: updatedCoffee.taste,
          category: updatedCoffee.category,
          details: updatedCoffee.details,
          photo: updatedCoffee.photo
        }
      }
      const result = await coffeeCollection.updateOne(filter, coffee, options )
      res.send(result);
    })


    //user related apis
    app.post('/user', async(req, res) => {
      const newUser = req.body;
      console.log(newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    })

    app.patch('/user', async(req, res) => {
        const user = req.body;
        const filter = { email: user.email}
        const updateDoc = {
          $set:{
            lastLoggedAt: user.lastLoggedAt
          }
        }
        const result = await userCollection.updateOne(filter, updateDoc);
        res.send(result);
    })


    app.get('/user/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await userCollection.findOne(query);
      res.send(result);
    })


    app.get('/user', async(req, res) => {
        const cursor = userCollection.find();
        const users = await cursor.toArray();
        res.send(users);
    })

    app.delete('/user/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await userCollection.deleteOne(query);
        res.send(result);
    })


// ============================== CRUD ACTION END =======================


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





//root panel start
app.get('/', async(req, res) => {
    res.send('Coffee marking server is running.. ')
})

app.listen(port, ()=>{
    console.log(`simple port running on, ${port}`)
})