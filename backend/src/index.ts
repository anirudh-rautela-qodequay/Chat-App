import express from "express";
import { createServer } from "http";

import dotenv from "dotenv";
import connectDB from "./database/dbconfig";
import routes from "./routes/route.mapping";
import cors from "cors";
import socketFile from "./socket/socket";
dotenv.config();
connectDB();

const app = express();
const httpServer = createServer(app);

socketFile(httpServer);

process.on("uncaughtException", (err) => {
  console.log(`Shutting down the server due to Uncaught Exception`);
  console.log(`Error: ${err.message}`);

  process.exit(1);
});

if (!process.env.JWT_SECRET) {
  console.warn("JWT secret missing");
  process.exit(1);
}
// Express example

app.use(
  cors({
    // origin: ["http://localhost:5173","http://localhost:5174"], // or "*" if you're okay with all origins
    origin: "*",
    credentials: true, // if using cookies
  })
);

// Middleware
app.use(express.json());

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
const server = httpServer.listen(process.env.PORT || 8080, () => {
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
