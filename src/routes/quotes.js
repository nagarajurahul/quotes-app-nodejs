import express from "express";
import { getRandomQuote } from "../controllers/quoteController.js";

const router = express.Router();

router.get("/random", getRandomQuote);

export default router;
