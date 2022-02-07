const fs = require('fs-extra');
const { getFakeOrder } = require("./getFakeOrders");
const streamFile = 'fake_data_stream.csv';
const outputFile = `${__dirname}\\csv2upload\\${streamFile}`;



function writeFakeDataStreams () {
  const myWriteStream = fs.createWriteStream(outputFile);
  for (let i=0; i<=10; i++) {
      myWriteStream.write(getFakeOrder());
    }
}

module.exports = {
    writeFakeDataStreams
}