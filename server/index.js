const express = require('express');
const { queryAll } = require("./postgreSQL/query");
const { insert } = require("./postgreSQL/db");

//const multer  = require('multer');
//const upload = multer({ dest: __dirname });


const app = express();
const port = 3000;
//app.use(express.static(__dirname +'/public'));



app.get('/', async (req, res) => {
    const q = await queryAll();
    if (q == []) {
        const insert = await insert();
        res.json({'orders created': insert})
    } else {
        res.json({'orders': q});
    }
});


/*
app.post('/test', upload.single('file'), (req, res) => {
  console.log('prova')
  const file = req.file;
  res.render('index.ejs')
});
*/

app.listen(port, () => {
  console.log('Server ready');
})