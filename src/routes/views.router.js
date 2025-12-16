const express = require("express");
const ProductManager = require("../managers/ProductManager");

const router = express.Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("home", { products, style: "home.css" });
  } catch (error) {
    res.status(500).send("Error al obtener productos");
  }
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", { style: "realTimeProducts.css" });
});

module.exports = router;
