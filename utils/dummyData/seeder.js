const fs = require("fs");
const Product = require("../../models/productModel");
const dbConnection = require("../../config/database");
const path = require("path");
require("dotenv").config({
  path: "../../config.env",
});

dbConnection();
console.log(process.argv);
const products = JSON.parse(fs.readFileSync("./product.json"));

const createProducts = async () => {
  try {
    await Product.create(products);
    console.log("done created!");
    process.exit(1);
  } catch (error) {
    console.log(error);
  }
};

const deleteAll = async () => {
  try {
    await Product.deleteMany();
    console.log("deleted successfully");
    process.exit(1);
  } catch (error) {
    console.log(error);
  }
};
if (process.argv[2] === "-i") {
  createProducts();
} else if (process.argv[2] === "-d") {
  deleteAll();
}
