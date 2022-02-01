const express = require('express');
const { queryAll } = require("./postgreSQL/query");

//const multer  = require('multer');
//const upload = multer({ dest: __dirname });


const app = express();
const port = 3000;
//app.use(express.static(__dirname +'/public'));
app.use(express.json());


app.get('/', async (req, res) => {
    const q = await queryAll();
    res.json(q);
});


app.get('/insert', async (req, res) => {
    const { insert } = require("./postgreSQL/insert");
    //const insertOrder = await insert();
    res.status(200);
    res.send('Order generated successfully')
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