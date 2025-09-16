import express from "express";
import { getWelcomeMessage } from "../controllers/welcomeController.js";

const router = express.Router();

router.get("/", getWelcomeMessage);


export default router;
