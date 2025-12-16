const express = require("express");
const ProductManager = require("../managers/ProductManager");

const router = express.Router();
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    const limit = req.query.limit;
    if (limit) {
      return res.json(products.slice(0, Number(limit)));
    }
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const pid = Number(req.params.pid);
    const product = await productManager.getProductById(pid);
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);

    const products = await productManager.getProducts();

    req.io.emit("products", products);

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const pid = Number(req.params.pid);
    const updatedProduct = await productManager.updateProduct(pid, req.body);
    if (!updatedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const pid = Number(req.params.pid);

    const isDeleted = await productManager.deleteProduct(pid);
    if (!isDeleted) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const products = await productManager.getProducts();

    req.io.emit("products", products);

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
