import express , {Router} from "express";
import {Register ,login , logout } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { deleteProfile } from "../controllers/auth.controller.js";
import { start } from "../controllers/auth.controller.js";

const authRouter:Router = express.Router();

authRouter.post("/Register",Register);
authRouter.post("/login",login);
authRouter.post("/logout",authMiddleware,logout);
authRouter.delete("/delete-Profile/:id",deleteProfile);

// this start is created for user who have logged in before but comes again and if he has verified token it will provide him with his data.
// jab bhi koi codix par jaayega sabse pehle api call aayega for "Start" from front-end.
authRouter.get("/start",authMiddleware,start);
// authRouter.get("/getProfile",getProfile);

export default authRouter;