import express from "express";
var router = express.Router();

// controllers
import { register } from "../controllers/register.js";
import { login } from "../controllers/login.js";
import { checkPin } from "../controllers/checkpin.js";
import { createpin } from "../controllers/createpin.js";
import { deletePin } from "../controllers/deletepin.js";

// Routes
router.post("/api/player/register", register);
router.post("/api/player/login", login);
router.post("/api/game/createpin", createpin);
router.get("/api/game/checkpin/:pin", checkPin);
router.delete("/api/game/deletepin/:pin", deletePin);

export default router;