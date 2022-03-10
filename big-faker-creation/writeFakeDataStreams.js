const fs = require("fs-extra");
const { getFakeOrder } = require("./getFakeOrders");
const streamFile = "fake_data_stream.csv";
const outputFile = `${__dirname}/csv2upload/${streamFile}`;

const fileHeader =
  "First Name;Last Name;Email;Address;Zip;City;Country;Phone;Username;Order Date;Order ID;Quantity;Product;Type;Color;Description;Price\n";

function writeFakeDataStreams(rowNumbers) {
  const myWriteStream = fs.createWriteStream(outputFile);
  myWriteStream.write(fileHeader);
  for (let i = 1; i <= rowNumbers; i++) {
    const fakeOrder = getFakeOrder();
    myWriteStream.write(fakeOrder);
  }
}

module.exports = {
  writeFakeDataStreams,
};
