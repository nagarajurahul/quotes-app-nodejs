import express from "express";
import { getHello } from "../controllers/helloController.js";

const router = express.Router();

router.get("/", getHello);


export default router;
