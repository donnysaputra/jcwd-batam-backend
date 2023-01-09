const url = require("url");
const http = require("http");
const { parse } = require("path");

const PORT = 2000;

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

http
  .createServer((req, res) => {
    const httpMethod = req.method;
    const parsedURL = url.parse(req.url, true);
    const path = parsedURL.path.split("/")[1];
    console.log(path);

    if (httpMethod == "GET") {
      if (path == "users") {
        res.write(JSON.stringify(users));
        res.end();
      } else {
        res.statusCode = 400; //bad request
        res.end("path not found");
      }
    } else if (httpMethod == "POST") {
      if (path == "users") {
        let resData = "";
        req.on("data", (data) => {
          //   console.log(data);
          console.log(data.toString());
          resData += data;
          users.push(JSON.parse(resData));
        });
        res.statusCode = 201; //created data

        res.end("new data created");
      }
    } else if (httpMethod == "PATCH") {
      if (path == "users") {
        req.on("data", (data) => {
          const parsedData = JSON.parse(data);
          // mengubah data buffer menjadi object
          const id = parsedURL.path.split("/")[2];
          //localhost:2000/users/2

          console.log(id);

          const findIndex = users.findIndex((val) => {
            return val.id == id;
          });

          if (findIndex == -1) {
            res.statusCode = 400; //bad request
            res.end("user id " + id + " not found");
            return;
          }
          //users[1] = {
          // ...{
          //     id: 2,
          //     nama: "sasuke",
          //     email: "sasuke@mail.com",
          //   } ,
          //    ... {
          // req.body
          //     }

          // }

          console.log(users[findIndex]);
          console.log(parsedData);

          users[findIndex] = {
            ...users[findIndex],
            ...parsedData,
          };

          res.end("data edited");
        });
      }
    } else if (httpMethod == "DELETE") {
      if (path == "users") {
        const id = parsedURL.path.split("/")[2];
        const findIndex = users.findIndex((val) => {
          return val.id == id;
        });

        if (findIndex == -1) {
          res.statusCode = 400; //bad request
          res.end("user id " + id + " not found");
          return;
        }

        users.splice(findIndex, 1);

        res.end("user id " + id + " deleted");
      }
    }

    //localhost:2000/users
  })
  .listen(PORT, () => {
    console.log("server is running on PORT " + PORT);
  });
