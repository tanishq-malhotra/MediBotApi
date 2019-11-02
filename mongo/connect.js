let mongoose = require("mongoose");

module.exports = () => {
  mongoose
    .connect("mongodb://localhost:27017/medibot", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      console.log("Successfully connected to Database");
    })
    .catch(error => {
      console.error("Error connecting to database: ", error);
    });
};
