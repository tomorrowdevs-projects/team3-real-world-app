/*
I want to create a big csv file (2GB) containing fake orders related to an Ecommerce.
I made it using two differents techniques:
1. Using streams to send the datas in chunks and reduce the RAM usage.
2. Using the classic append sync method, creating n rows in blocks and add them to the original file.
*/

// appendFake uses the append method
const { appendFake } = require("./src/appendFakeData");

// writeFakeDataStreams uses the streams method
const { writeFakeDataStreams } = require("./src/writeFakeDataStreams");


// ask to user which option prefers and call the function
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
readline.question("How many rows do you want to create? ", rowNumbers => {
  readline.question('Do you want to create the csv using streams (0) or in append sync mode (1)? ', createFile => {
    
    console.log(`Ok row numbers ${rowNumbers}`);

    if (createFile == 0) {
      console.log(`Ok Streams!`);
      writeFakeDataStreams(rowNumbers);
    } else if (createFile == 1) {
      console.log(`Ok Sync!`);
      appendFake(rowNumbers);
    }

  readline.close();
  });
})