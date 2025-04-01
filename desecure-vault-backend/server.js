import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import Session from "express-session";
import router from "./src/routes/index.js";
const app = express();
const PORT = process.env.PORT || 8000;

dotenv.config()
app.use(express.json());
// configure cors and sessions
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

app.use('/api', router)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
