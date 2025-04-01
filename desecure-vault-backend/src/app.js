import express from "express";
import routes from "./routes/index.js"; // Ensure file has .js extension
import errorHandler from "./middlewares/errorHandler.js";

const app = express();
app.use(express.json());
app.use('/api', routes);
app.use(errorHandler);

module.exports = app;