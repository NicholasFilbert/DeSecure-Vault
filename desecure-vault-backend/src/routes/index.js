import express from "express";
import defaultRoutes from "./default.routes.js";
import siweRoutes from "./auth/siwe.routes.js"; 
// import ipfsRoutes from "./ipfs/ipfs.routes.js";
import fileRoutes from "./files/files.routes.js";
import requireSiweAuth from "../middlewares/apiAuth.js";

const router = express.Router();
const siweRouter = express.Router()

// Register Auth by SIWE
siweRouter.use(requireSiweAuth);

// Register Protected Routes
// siweRouter.use('/ipfs', ipfsRoutes);
siweRouter.use('/', defaultRoutes);
siweRouter.use('/files', fileRoutes)

// Register Non-Protected Routes
router.use('/auth', siweRoutes);

// Register siweRouter
router.use('/', siweRouter)

export default router;
