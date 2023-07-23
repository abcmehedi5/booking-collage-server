const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const Colleges = require("./collage.json");
const Research = require("./research.json");
const Review = require("./review.json");
const admissionData = require("./admissionData.json");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.13ytubh.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });

    const db = client.db("booking-college");
    const reviewCollection = db.collection("review");
    const admissionCollection = db.collection("admission");
    const collegeCollection = db.collection("college");

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    // all api routes

    // collage -------------------
    app.get("/collage", async (req, res) => {
      try {
        const result = await collegeCollection.find().toArray();
        res.send(result);
      } catch (error) {
        res.status(500).json({ error: true, message: error.message });
      }
      // res.send(Colleges);
    });

    // /research------------------
    app.get("/research", (req, res) => {
      res.send(Research);
    });
    // review----------------------

    app.post("/review", async (req, res) => {
      const reviewData = req.body;
      console.log(reviewData);
      try {
        const result = await reviewCollection.insertOne(reviewData);
        res.status(200).send(result);
      } catch (error) {
        res.status(500).json({ error: true, message: error.message });
      }
    });
    app.get("/review", async (req, res) => {
      try {
        const result = await reviewCollection.find().toArray();
        res.send(result);
      } catch (error) {}
      // res.send(Review);
    });

    // admission ------------------
    app.post("/admission", async (req, res) => {
      const admissionData = req.body;
      try {
        const result = await admissionCollection.insertOne(admissionData);
        res.status(200).json({
          error: false,
          data: result,
          message: "Admission successfull",
        });
      } catch (error) {
        res.status(500).json({ error: true, message: error.message });
      }
    });

    app.get("/admission", async (req, res) => {
      const email = req.query.email;
      try {
        const result = await admissionCollection.find({ email }).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).json({ error: true, message: error.message });
      }
    });

    app.get("/admission-college/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      try {
        const result = await collegeCollection.findOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).json({ error: true, message: error.message });
      }
    });

    //  admission information update

    app.patch("/admission/:id", async (req, res) => {
      const id = req.params.id;
      const { candidateName, address, college_name } = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateData = {
        $set: {
          candidateName: candidateName,
          address: address,
          college_name: college_name,
        },
      };
      try {
        const result = await admissionCollection.updateOne(
          filter,
          updateData,
          options
        );
        res.status(200).send(result);
      } catch (error) {
        res.status(500).send(error);
      }
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Booking collage app listening on port ${port}`);
});
