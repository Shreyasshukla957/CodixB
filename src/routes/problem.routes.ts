import express, { Router } from "express"
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { CreateProblem } from "../controllers/problem.controller.js"


const problemrouter: Router = Router();


// CRUD operations by Admin on Problem

// Admin access is Required
problemrouter.post("/create", adminMiddleware, CreateProblem);
// problemrouter.patch("/:id",adminMiddleware,UpdateProblem);
// problemrouter.delete("/:id",adminMiddleware,DeleteProblem); 

// Anyone can access
// problemrouter.get("/:id",authMiddleware,FetchProblem);
// problemrouter.get("/",authMiddleware,FetchAllProblem);
// problemrouter.get("/user",authMiddleware,SolvedProblem);

export default problemrouter;