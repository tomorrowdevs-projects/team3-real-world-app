const fs = require("fs-extra");
const { getFakeOrder } = require("./getFakeOrders");
const streamFile = "fake_data_stream.csv";
const outputFile = `${__dirname}/../csv2upload/${streamFile}`;

const fileHeader =
  "First Name;Last Name;Email;Address;Zip;City;Country;Phone;Username;Order Date;Order ID;Quantity;Product;Type;Color;Description;Price\n";


function writeFakeDataStreams(rowNumbers) {

  const myWriteStream = fs.createWriteStream(outputFile);

  myWriteStream
  .on('open', () => {
    console.log('Started to write faker file');
    writeFake(true);
  })
  .on('close', () => console.log('faker file created'))
  
  function writeFake (header=false) {
    let ok = true;
    if (header === true) {
      ok = myWriteStream.write(fileHeader);
    }
    do {
      rowNumbers--;
      ok = myWriteStream.write(getFakeOrder());
    } while (rowNumbers > 0 && ok);
    if (rowNumbers > 0) {
      // Had to stop early!
      // Write some more once it drains.
      myWriteStream.once('drain', writeFake);
    } else {
      myWriteStream.end(getFakeOrder())
    }
  }
}


module.exports = {
  writeFakeDataStreams,
};