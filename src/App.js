const express = require("express");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const http = require("http");
const path = require("path");

const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const viewsRouter = require("./routes/views.router");

const ProductManager = require("./managers/ProductManager");
const productManager = new ProductManager();

const app = express();
const PORT = 8080;

const server = http.createServer(app);

const io = new Server(server);

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

io.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado vía WebSocket");

  try {
    const products = await productManager.getProducts();
    socket.emit("products", products);
  } catch (error) {
    console.error("Error al leer productos para el socket: ", error);
  }
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
