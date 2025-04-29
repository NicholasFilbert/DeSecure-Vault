import express from "express";
import cors from "cors";
import Session from "express-session";
import routes from "./routes/index.js"; // Ensure file has .js extension
import errorHandler from "./middlewares/errorHandler.js";

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // frontend URL
    credentials: true,
  })
);
app.use(
  Session({
    name: "shadow-vault", 
    secret: process.env.JWT_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false, sameSite: "lax", maxAge: 24 * 60 * 60 * 1000 },
  })
);


app.use(express.json());
app.use('/api', routes);
app.use(errorHandler);

export default app;