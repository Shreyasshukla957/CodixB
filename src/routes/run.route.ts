import express , {Router} from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { Runcode } from "../controllers/usersubmit.controller.js";

export const runrouter = express.Router();

runrouter.post("/:id" , authMiddleware, Runcode);