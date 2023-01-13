const fs = require("fs");

const savedJSON = (database) => {
  fs.writeFile(
    "./src/database/db.json",
    JSON.stringify(database),
    function (err) {
      if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
      }
    }
  );
};

module.exports = savedJSON;
