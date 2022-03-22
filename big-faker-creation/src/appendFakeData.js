const fs = require("fs-extra");
const { getFakeOrder } = require("./getFakeOrders");
const file = "fake_data_append.csv";
const outputFile = `${__dirname}/../csv2upload/${file}`;

const fileHeader =
  "First Name;Last Name;Email;Address;Zip;City;Country;Phone;Username;Order Date;Order ID;Quantity;Product;Type;Color;Description;Price\n";

function appendFake(rowNumbers) {
  fs.appendFileSync(outputFile, fileHeader, (err) => {
    if (err) {
      console.log(err);
    }
    return;
  });
  for (let i = 1; i <= rowNumbers; i++) {
    fs.appendFileSync(outputFile, getFakeOrder(), (err) => {
      if (err) {
        console.log(err);
      }
      return;
    });
    if (i % 100 === 0) {
      console.log(`Updated block ${i}, file ${file}`);
    }
  }

  console.log(`File Completed`);
}

module.exports = {
  appendFake,
};
