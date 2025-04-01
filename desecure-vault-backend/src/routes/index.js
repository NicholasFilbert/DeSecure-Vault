import express from "express";
import defaultRoutes from "./default.routes.js"; // Ensure the `.js` extension is included
import siweRoutes from "./auth/siwe.routes.js"; // Ensure the `.js` extension is included

const router = express.Router();

// Define routes
router.use('/auth', siweRoutes);
router.use('/', defaultRoutes);
// router.use('/users', userRoutes);

export default router;
