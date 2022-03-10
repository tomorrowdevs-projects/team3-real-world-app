//const { queryAll } = require("./query-db/query");
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
    jwksUri: "https://dev-b776ij9u.us.auth0.com/.well-known/jwks.json",
  }),
  audience: "http://localhost:3000/api",
  issuer: "https://dev-b776ij9u.us.auth0.com/",
  algorithms: ["RS256"],
});

app.use(jwtCheck);

app.use("/", require("./routes/upload"));

app.get("/getAll", async (req, res) => {
  const q = await queryAll();
  res.json(q);
});

app.listen(port, () => {
  console.log("Server ready");
});
