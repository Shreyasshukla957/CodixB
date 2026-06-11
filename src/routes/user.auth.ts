import express , {Router} from "express";
import {Register ,login , logout } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { deleteProfile } from "../controllers/auth.controller.js";

const authRouter:Router = express.Router();

authRouter.post("/Register",Register);
authRouter.post("/login",login);
authRouter.post("/logout",authMiddleware,logout);
authRouter.delete("/delete-Profile/:id",deleteProfile);
// authRouter.get("/getProfile",getProfile);

export default authRouter;