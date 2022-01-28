const express = require("express");
const indexRouter = require("./routes/index.js")
const {
    auth
} = require('express-openid-connect');
require("dotenv").config()


const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASEURL,
    clientID: process.env.CLIENTID,
    issuerBaseURL: process.env.ISSUER
};

const app = express();
app.set("views", "views");
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static("public"));
app.use(auth(config));

app.use("/", indexRouter);

app.listen(3000, () => {
    console.log("Server running on port 3000")
});