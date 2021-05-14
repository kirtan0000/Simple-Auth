import express from "express";
import path from "path";
import cors from "cors";
import { create } from "./util/connection";

create();
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const http = require("http");
const app = express();
const server = http.createServer(app);
const port = 4000;

// Cors
const corsOptions = {
  origin: "*", // All requests
  optionsSuccessStatus: 200,
};

// Routers
const AuthRouter = require("./routes/Auth");

const limiterMessage = {
  success: false,
  message:
    "You have been temporarily rate limited. Please come back in 10 minutes.",
};

const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 40,
  message: limiterMessage,
});

// Middlewares
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use("/", AuthRouter);
app.use("/login", authLimiter);
app.use("/create-user", authLimiter);
app.enable("trust proxy");
app.set("trust proxy", 1);

// Start the http server
server.listen(port, () =>
  console.log(`Server started at http://localhost:${port}`)
);
