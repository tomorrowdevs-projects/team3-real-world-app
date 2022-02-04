const faker = require('faker');

function getFakeOrder() {

  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = faker.internet.email();
  const streetAddress = faker.address.streetAddress();
  const zipCode = faker.address.zipCode();
  const city = faker.address.city();
  const country = faker.address.country();
  const phone = faker.phone.phoneNumber()
  const userName = faker.internet.userName();
  const orderDate = faker.date.past();
  const orderId = faker.datatype.number();
  const orderQuantity = faker.datatype.number();
  const product = faker.commerce.productName();
  const productType = faker.commerce.product();
  const productColor = faker.commerce.color();
  const productDescr = faker.commerce.productDescription();
  const orderPrice = faker.commerce.price();

  return `${firstName};${lastName};${email};${streetAddress};${zipCode};${city};${country};${phone};${userName};${orderDate};${orderId};${orderQuantity};${product};${productType};${productColor};${productDescr};
          ${orderPrice}\n`;

}

module.exports = {
  getFakeOrder
}