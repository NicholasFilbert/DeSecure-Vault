import express from "express";
import { test } from "../controllers/default.controller.js"; // Ensure `.js` extension is included

const router = express.Router();

// const userController = require('../controllers/user.controller');
// const validate = require('../validations/user.validation');
// const authMiddleware = require('../middlewares/auth');

router.get('/', test);

export default router;