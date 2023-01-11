const fs = require("fs");

const savedJSON = (database) => {
  fs.writeFile(
    "./src/database/data.json",
    JSON.stringify(database),
    function (err) {
      if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
      }
      console.log("JSON file has been saved.");
    }
  );
};

module.exports = savedJSON;
