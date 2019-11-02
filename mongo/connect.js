let mongoose = require("mongoose");

module.exports = () => {
  mongoose.connect(
    "mongodb+srv://Admin:uNyCHSSDl5bVAqL5@cluster0-dvhcj.azure.mongodb.net/medibot?retryWrites=true&w=majority",
     {
            auth: {
                user: "Admin",
                password: "uNyCHSSDl5bVAqL5",
            },
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
