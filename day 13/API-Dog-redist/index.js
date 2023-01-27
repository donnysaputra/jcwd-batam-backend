const express = require("express");
const port = 2000;
const app = express();

const axios = require("axios");

const redis = require("redis");

const client = redis.createClient({
  url: `redis://localhost:6379`,
  legacyMode: true,
});

client.on("error", (error) => {
  console.log(error);
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

app.get("/dogs/:breed", async (req, res) => {
  if (!client.isOpen) {
    client.connect();
  }
  try {
    const breed = req.params.breed;
    const clientGet = (dog) => {
      return new Promise((fullfill, reject) => {
        client.get(dog, (err, data) => {
          if (err) reject(err);
          else fullfill(data);
        });
      });
    };

    let dog_cache = await clientGet(breed);
    dog_cache = JSON.parse(dog_cache);

    if (dog_cache?.status === "success") {
      return res.status(200).send(dog_cache);
    }

    // console.log(dog_cache);

    const { data } = await axios.get(
      `https://dog.ceo/api/breed/${breed}/images`
    );

    client.set(breed, JSON.stringify(data));

    return res.status(200).send(data);
  } catch (error) {
    return res.status(400).send(error.toString());
  }
});
