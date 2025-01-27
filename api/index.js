import express, { json } from "express";
import { connectDB, sequelize } from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";
import { Server as SocketServer } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new SocketServer(server , {
  cors: {
    origin: "*",
  },  
});

// Conectar a la base de datos
connectDB();

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

app.use(cors());
app.use(json());

// Sincronizar modelos con la base de datos
sequelize
  .sync({ alter: true })
  .then(() => console.log("Modelos sincronizados"));

// Rutas
app.use("/api", userRoutes);

// Configuración de WebSocket con socket.io
io.on("connection", (socket) => {
  console.log('client connected');

  socket.on("message", (data) => {
    socket.broadcast.emit("message", data);
  });
  
});

// Configuración del puerto
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});