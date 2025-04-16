import express from "express";

import dotenv from "dotenv";
import connectDB from "./database/dbconfig";
import routes from "./routes/route.mapping";
// import logger from "./middleware/logger.middleware";
import cors from "cors";
dotenv.config();

connectDB();

const app = express();

process.on("uncaughtException", (err) => {
  console.log(`Shutting down the server due to Uncaught Exception`);
  console.log(`Error: ${err.message}`);

  process.exit(1);
});

// Express example

app.use(cors({
  // origin: ["http://localhost:5173","http://localhost:5174"], // or "*" if you're okay with all origins
  origin:"*",
  credentials: true, // if using cookies
}));


// Middleware
app.use(express.json());
// app.use(logger);

// import "./services/firebase.service";
// // root route
app.get("/", (_, res) => res.send("Backend is LIVE!"));
app.use("/api/v1", routes);

app.all("*", (req, res) => {
  const message = `Can't find (Method: ${req.method}) and (Url: ${req.originalUrl}) on this server`;
  return res.status(404).json({
    statusCode: 404,
    message: message,
  });
});
// Start the server
const server = app.listen(process.env.PORT || 8080, () => {
  console.log(`Server is running on port ${process.env.PORT || 8080}`);
  console.log(`http://localhost:${process.env.PORT}`);
});
process.on("unhandledRejection", (err: Error) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});