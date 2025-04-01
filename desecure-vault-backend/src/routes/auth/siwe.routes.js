import express from "express";
import { nonce, session, signout, verify, verifySession } from "../../controllers/auth/siwe.controller.js";

const router = express.Router();

router.get("/nonce", nonce);
router.post("/verify", verify);
router.get("/session", session);
router.get("/verify-session", verifySession)
router.get("/signout", signout);

export default router;