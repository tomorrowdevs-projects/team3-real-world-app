const fs = require('fs-extra');
const {
  getFakeOrder
} = require("./getFakeOrders");
const streamFile = 'fake_data_stream.csv';
const outputFile = `${__dirname}\\csv2upload\\${streamFile}`;



function writeFakeDataStreams() {
  const myWriteStream = fs.createWriteStream(outputFile);
  myWriteStream.write("firstName;lastName;email;address;zipCode;city;country;phone;userName;orderDate;orderId;orderQuantity;productName;productType;productColor;productDescr;orderPrice\n")
  for (let i = 0; i <= 70; i++) {
    for (let j = 0; j <= 100; j++) {
      myWriteStream.write(getFakeOrder());
    }
  }
}

module.exports = {
  writeFakeDataStreams
}