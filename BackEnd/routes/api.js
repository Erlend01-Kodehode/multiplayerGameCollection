import express from "express";
var router = express.Router();

// controllers
import { register } from "../controllers/register.js";
import { login } from "../controllers/login.js";
import { checkpin } from "../controllers/checkpin.js";

// Routes
router.post("/api/player/register", register);
router.post("/api/player/login", login);
router.get("/api/game/checkpin", checkpin);

export default router;
