const express = require("express");
const handlebars = require("express-handlebars");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const http = require("http");
const path = require("path");

const productsRouter = require("./routes/products.router");
const cartsRouter = require("./routes/carts.router");
const viewsRouter = require("./routes/views.router");

const app = express();
const PORT = 8080;

const MONGO_URL = "mongodb://127.0.0.1:27017/apiarios_el_toti";

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("Conectado exitosamente a la Base de Datos MongoDB"))
  .catch((error) => console.error("Error al conectar a MongoDB:", error));

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

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
