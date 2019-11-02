'use strict';

let express = require("express");
let app = express();
let routes = require("./routes");
let jsonParser = require("body-parser").json;
let logger = require("morgan");
let mongoConnect = require("./mongo/connect");

app.use(logger("dev"));
app.use(jsonParser());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT,POST,DELETE");
        return res.status(200).json({});
    }
    next();
});

mongoConnect();

app.use(routes);

app.use((req, res, next) => {
    let err = new Error("Not Found!");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    });
});

let port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("API listening on port " + port);
});