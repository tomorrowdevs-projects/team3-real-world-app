const { queryAll } = require("./postgreSQL/query");
const { insert } = require("./postgreSQL/insert-create");
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const uploadPath = path.join(__dirname, "csv/");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const filename = req.params.filename.slice(0, -4);
    const dir = __dirname + `/csv/${filename}/`;

    fs.exists(dir, (exist) => {
      if (!exist) {
        return fs.mkdir(dir, (error) => cb(error, dir));
      }
      return cb(null, dir);
    });
  },
  filename: function (req, file, cb) {
    const { chunkNumber, filename } = req.params;

    const extension = path.extname(filename);
    const baseFilename = path.basename(filename, extension);
    const tempfilename = baseFilename + "-" + chunkNumber;

    cb(null, tempfilename);
  },
});
const upload = multer({ storage: storage });

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.get("/getAll", async (req, res) => {
  const q = await queryAll();
  res.json(q);
});

app.get("/insert", async (req, res) => {
  const insertOrder = await insert();
  res.status(200);
  res.send("Order generated successfully");
});

/**
 * API to upload the file with the multer library
 * Post the file from the frontend and 
 */
app.post("/upload/:filename/:chunkNumber", upload.single("file"), (req, res) => {
  const file = req.file;
  console.log("file caricato");
  res.json({ chunkNumber: req.params.chunkNumber });
});

app.get("/data/:filename/:chunkNumber", (req, res) => {
  const { filename, chunkNumber } = req.params;

  const chunksPath = path.join(uploadPath, `${filename.slice(0, -4)}`);
  const filePath = path.join(uploadPath, `uploaded/${filename}`);

  const chunks = fs.readdirSync(chunksPath);

  // Create Storage File
  fs.writeFileSync(filePath, "");
  if (chunks.length !== Number(chunkNumber) || chunks.length === 0) {
    res.status = 200;
    // res.end("Number of slice files does not match");
    res.json({ chunkNumber: req.params.chunkNumber, message: "Number of slice files does not match"})
    return;
  }
  for (let i = 1; i <= Number(chunkNumber); i++) {
    // Append Write to File
    fs.appendFileSync(filePath, fs.readFileSync(chunksPath + `/${filename.slice(0, -4)}` + "-" + i));
    // Delete chunks used
    fs.unlinkSync(chunksPath + `/${filename.slice(0, -4)}` + "-" + i);
  }
  fs.rmdirSync(chunksPath);
  // File merge succeeded, file information can be stored in the library.
  res.status = 200;
  res.end("Merge succeeded");
});

app.listen(port, () => {
  console.log("Server ready");
});
