const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const uploadPath = path.join(__dirname, "../csv/");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const filename = req.params.filename.slice(0, -4);
    const dir = uploadPath + `/${filename}/`;

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

/**
 * API to upload the file with the multer library
 * Post the file from the frontend and
 */
router.post("/upload/:filename/:chunkNumber", upload.single("file"), (req, res) => {
  const file = req.file;
  console.log("file caricato");
  res.json({ chunkNumber: req.params.chunkNumber });
});

/**
 * API to merge the chunks into the file
 */
router.get("/data/:filename/:chunkNumber", (req, res) => {
  const { filename, chunkNumber } = req.params;

  const chunksPath = path.join(uploadPath, `${filename.slice(0, -4)}`);
  const filePath = path.join(uploadPath, `uploaded/${filename}`);

  const chunks = fs.readdirSync(chunksPath);

  // Create Storage File
  fs.writeFileSync(filePath, "");
  if (chunks.length !== Number(chunkNumber) || chunks.length === 0) {
    res.status = 200;
    res.json({ chunkNumber: req.params.chunkNumber, message: "Number of slice files does not match" });
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

module.exports = router;