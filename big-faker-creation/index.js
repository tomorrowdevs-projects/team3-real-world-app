const { appendFake } = require("./appendFakeData");
const { writeFakeDataStreams } = require("./writeFakeDataStreams");


const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  readline.question('Do you want to create the csv using streams (0) or in append sync mode (1)? ', createFile => {
      if (createFile == 0) {
        console.log(`Ok Streams!`);
        writeFakeDataStreams();
      } else if (createFile == 1) {
        console.log(`Ok Sync!`);
        appendFake();
      }
    
    readline.close();
  });