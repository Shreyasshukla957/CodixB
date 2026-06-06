import express , {Router} from "express"
import {authMiddleware} from "../middlewares/auth.middleware.js"
import  {usersubmission} from "../controllers/usersubmit.controller.js"

export const submitrouter = express.Router();


submitrouter.post("/:id",authMiddleware,usersubmission);
