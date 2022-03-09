const { ro } = require("faker/lib/locales");
const fs = require("fs-extra");
const { getFakeOrder } = require("./getFakeOrders");
const streamFile = "fake_data_stream.csv";
const outputFile = `${__dirname}/csv2upload/${streamFile}`;

const fileHeader =
  "First Name;Last Name;Email;Address;Zip;City;Country;Phone;Username;Order Date;Order ID;Quantity;Product;Type;Color;Description;Price\n";

function writeFakeDataStreams(rowNumbers) {
  const myWriteStream = fs.createWriteStream(outputFile, { flags: "a" });
  myWriteStream.write(fileHeader);
  for (let i = 1; i <= rowNumbers; i++) {
    if (i === Number(rowNumbers)) {
      const lastRow = getFakeOrder().slice(0, -1);
      myWriteStream.write(lastRow);
    } else {
      myWriteStream.write(getFakeOrder());
    }
  }
}

module.exports = {
  writeFakeDataStreams,
};
