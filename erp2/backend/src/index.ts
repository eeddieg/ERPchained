import express from "express";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import handleError from "./middleware/error.middleware";
import logger from "./middleware/logger.middleware";

import router from "./routes/index.router";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT as string, 10) | 4002;
const uriPath = "/api";

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true}));
app.use(logger);
app.use(handleError);

app.use(`${uriPath}`, router);

const server = app.listen(PORT, () => {
  console.log(`API Server started on http://localhost:${PORT}${uriPath}`);
})

// const io = new Server(server);
// io.on("connection", (socket) => {
//   console.log("Socket connection established\n");
//   console.log(socket);
// });