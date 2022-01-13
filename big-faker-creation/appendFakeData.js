const fs = require('fs-extra');
const { getFakeOrder } = require("./getFakeOrders");
const file = 'fake_data_append.csv';
const outputFile = `${__dirname}\\csv2upload\\${file}`


function appendFake () {
    for (let i=0; i<=250; i++) {
        for (let j=0; j<=10000; j++) {
          
          fs.appendFileSync(outputFile, getFakeOrder(), (err) => {
            if (err) {console.log(err)};
            return;
          });
      
        }
        if ((i%10)===0) {console.log(`Updated block ${i}, file ${file}`)};
      }
      
      console.log(`Test Terminated`);
}


module.exports = {
    appendFake
  }