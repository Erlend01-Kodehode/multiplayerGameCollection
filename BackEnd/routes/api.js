import express from "express";
var router = express.Router();

// controllers
import { register } from "../controllers/register.js";
import { login } from "../controllers/login.js";

// Routes
router.post("/api/player/register", register);
router.post("/api/player/login", login);

export default router;
