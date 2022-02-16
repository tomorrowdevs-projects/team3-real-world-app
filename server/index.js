const express = require("express")
const cors = require("cors")
const { queryAll } = require("./postgreSQL/query")
const { insert } = require("./postgreSQL/insert")

const multer = require("multer")
const upload = multer({ dest: __dirname + "/csv" })

const app = express()
const port = 3000
//app.use(express.static(__dirname +'/public'));
app.use(express.json())
app.use(cors())

app.get("/getAll", async (req, res) => {
  const q = await queryAll()
  res.json(q)
})

app.get("/insert", async (req, res) => {
  const insertOrder = await insert();
  res.status(200)
  res.send("Order generated successfully")
})

app.post("/upload", upload.single("file"), (req, res) => {
  const file = req.file
  // loopCSV(file);
  res.send("file caricato")
})

app.listen(port, () => {
  console.log("Server ready")
})
