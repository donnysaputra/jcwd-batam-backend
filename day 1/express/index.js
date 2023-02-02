const express = require("express");
var bodyParser = require("body-parser");

const app = express();
const PORT = 2000;
app.use(express.json());
const router = express.Router();

// const bodyParser = require("body-parser");

const products = [
  {
    id: 1,
    nama_produk: "sepeda",
    stock: 100,
  },
  {
    id: 2,
    nama_produk: "sepeda lipat",
    stock: 50,
  },
];

app.get("/products", (req, res) => {
  res.status(200).json({
    message: "products fetched",
    result: products,
  });
});
HEHEHEHE
app.post("/products", (req, res) => {
  const data = req.body; //kita ambil data dari req.body
  console.log(data); // data kita tampilkan lewat console.log
  products.push(data); //kita memasukan data baru ke dalam array products
  res.status(201).json({
    message: "new product added",
    result: data,
  });
});

app.patch("/products/:id", (req, res) => {
  const data = req.body; //untuk mengambil data dari req.body
  const id = req.params.id; //mengambil value id dari req.params di url

  const findIndex = products.findIndex((val) => {
    return val.id == id;
  }); //mencari index di dalam array products,
  //dimana id di dalam products sama dengan id di params

  if (findIndex == -1) {
    //apabila index dari id yang dicari tidak ketemu

    res.status(400).json({
      message: "id not found",
    });
    return;
  }

  products[findIndex] = {
    ...products[findIndex],
    ...data,
  };
  //isi dari products dengan id yang ditemukan,
  //direplace dengan isi dari data sesuai dengan keys dalam objectnya

  res.status(201).json({
    message: "product edited",
    result: products[findIndex],
  });
});

app.delete("/products/:id", (req, res) => {
  const id = req.params.id; //mengambil value id dari req.params di url
  const findIndex = products.findIndex((val) => {
    return val.id == id;
  }); //mencari index di dalam array products,
  //dimana id di dalam products sama dengan id di params

  if (findIndex == -1) {
    //apabila index dari id yang dicari tidak ketemu

    res.status(400).json({
      message: "id not found",
    });
    return;
  }

  products.splice(findIndex, 1);

  res.status(200).json({
    message: "product deleted",
  });
});

app.put("/products/:id", (req, res) => {
  const data = req.body; //untuk mengambil data dari req.body
  const id = req.params.id; //mengambil value id dari req.params di url

  const findIndex = products.findIndex((val) => {
    return val.id == id;
  }); //mencari index di dalam array products,
  //dimana id di dalam products sama dengan id di params

  if (findIndex == -1) {
    //apabila index dari id yang dicari tidak ketemu

    res.status(400).json({
      message: "id not found",
    });
    return;
  }

  products[findIndex] = {
    ...data,
  };
  //isi dari products dengan id yang ditemukan,
  //direplace dengan isi dari data sesuai dengan keys dalam objectnya

  res.status(201).json({
    message: "product edited",
    result: products[findIndex],
  });
});

const users = [
  {
    id: 1,
    nama: "udin",
    email: "udin@mail.com",
  },
  {
    id: 2,
    nama: "sasuke",
    email: "sasuke@mail.com",
  },
];

app.get("/", (req, res) => {
  res.send("this is simple API");
});

app.get("/users/:id", (req, res) => {
  let id = req.params.id;
  console.log(id);

  const filteredUser = users.find((val) => {
    return val.id == id;
  });

  console.log(filteredUser);

  res.status(200).json({
    message: "user data fetched",
    result: filteredUser,
  });
});

app.get(
  "/next",
  (req, res, next) => {
    console.log("abc");
    next();
  },
  (req, res) => {
    res.send("hello next");
  }
);

const key = "abc";

router.use((req, res, next) => {
  if (req.headers["x-secret-key"] === key) {
    console.log("user validated");
    next();
    return;
  }

  res.status(401).json({
    message: "user unauthorized",
  });
  return;
});

router.use("/", (req, res, next) => {
  console.log("hello");
  res.send("hello");
});

app.use("/calendar", router);

// app.use("/calendar", router);

app.get("/users", (req, res) => {
  console.log(req.url);
  let nama = req.query.nama;

  if (!nama) {
    res.status(200).json({
      message: "user data fetched",
      result: users,
    });
  } else {
    const filteredUser = users.filter((val) => {
      return val.nama == nama;
    });
    res.status(200).json({
      message: "user data fetched",
      result: filteredUser,
    });
  }
});

app.get("/a/:id", (req, res) => {
  const id = req.params.id;
  const user = users.find((val) => {
    return val.id == id;
  });

  res.status(200).json({
    result: user,
  });
});

app.get("/b/satu", (req, res) => {
  const id = "1";
  res.redirect("/a/" + id);
});
// localhost:2000/b/satu => localhost:2000/a/1

app.post("/users", (req, res) => {
  const data = req.body;
  console.log(data);
  users.push(data);
  res.status(200).json({
    message: "new user added",
    result: data,
  });
});

app.patch("/users/:id", (req, res) => {
  const id = req.params.id;
  const data = req.body;

  const findIndex = users.findIndex((val) => {
    return val.id == id;
  });

  if (findIndex == -1) {
    res.status(400).json({
      message: "user id " + id + " not found",
    });
    return;
  }

  users[findIndex] = {
    ...users[findIndex],
    ...data,
  };

  res.status(200).json({
    message: "user id " + id + " edited",
    result: users[findIndex],
  });
});

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;

  const findIndex = users.findIndex((val) => {
    return val.id == id;
  });

  if (findIndex == -1) {
    res.status(400).json({
      message: "user id " + id + " not found",
    });
    return;
  }

  users.splice(findIndex, 1);

  res.status(200).json({
    message: "user id " + id + " deleted",
  });
});

app.listen(PORT, () => {
  console.log("server is running on PORT " + PORT);
});
