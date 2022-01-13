const faker = require('faker');

function getFakeOrder () {

  const entireName = faker.name.findName();
  const email = faker.internet.email();
  const streetAddress = faker.address.streetAddress();
  const zipCode = faker.address.zipCode();
  const city = faker.address.city();
  const country = faker.address.country();
  const phone = faker.phone.phoneNumber()
  const userName = faker.internet.userName();
  const pastDate = faker.date.past();
  const product = faker.commerce.productName();
  const productType = faker.commerce.product();
  const productColor = faker.commerce.color();
  const productDescr = faker.commerce.productDescription();
  const price = faker.commerce.price();

  return `${entireName}; ${email}; ${streetAddress}; ${zipCode}; ${city}; ${country}; ${phone}; ${userName}; ${pastDate}; ${product}; ${productType}; ${productColor}; ${productDescr}; ${price}\n`;

}

module.exports = {
  getFakeOrder
}