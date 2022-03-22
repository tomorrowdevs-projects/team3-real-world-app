const express = require("express");
const cors = require("cors");
const jwt = require("express-jwt");
const jwks = require("jwks-rsa");

require("dotenv").config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

var jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.URI,
  }),
  audience: process.env.AUDIENCE,
  issuer: process.env.ISSUER,
  algorithms: ["RS256"],
});

app.use(jwtCheck);

app.use("/", require("./routes/upload"));
app.use("/", require("./routes/filters"));

app.listen(port, () => {
  console.log("Server ready");
});