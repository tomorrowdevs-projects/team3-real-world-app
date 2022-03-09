const { writeFakeDataStreams } = require("./writeFakeDataStreams");
const { appendFake } = require("./appendFakeData");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question("How many rows do you want to create? ", (rowNumbers) => {
  console.log(`Ok row numbers ${rowNumbers}`);
  appendFake(rowNumbers);

  readline.close();
});
