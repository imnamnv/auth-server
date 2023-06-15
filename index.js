// Main starting point of the application
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
const router = require("./router");

// App Setup
app.use(morgan("combined")); // middleware: logging framework
app.use(bodyParser.json({ type: "*/*" })); // middleware: parse body to json. no matter request's type
router(app);

// Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app); //receive the request and forward it to app
server.listen(port);

console.log("Server listening on: ", port);
