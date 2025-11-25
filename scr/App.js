const express = require("express");
const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.get("/", (req, res) => {
  res.send("¡Bienvenido a la API de Apiarios El Toti!");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
