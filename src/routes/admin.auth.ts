import express, { Router } from "express";
import { login } from "../controllers/auth.controller.js";
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { AdminRegister } from "../controllers/auth.controller.js";
const adminRouter: Router = express.Router();


adminRouter.post("/Register", adminMiddleware, AdminRegister);
adminRouter.post("/login", adminMiddleware, login);


export default adminRouter;