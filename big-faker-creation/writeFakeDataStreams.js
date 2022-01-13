const fs = require('fs-extra');
const { getFakeOrder } = require("./getFakeOrders");
const streamFile = 'fake_data_stream.csv';
const outputFile = `${__dirname}\\csv2upload\\${streamFile}`;



function writeFakeDataStreams () {
  const myWriteStream = fs.createWriteStream(outputFile);
  for (let i=0; i<=70; i++) {
      for (let j=0; j<=100000; j++) {
        myWriteStream.write(getFakeOrder());
      }
    }
}

module.exports = {
    writeFakeDataStreams
}