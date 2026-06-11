import express, { Router } from "express"
import { adminMiddleware } from "../middlewares/admin.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { CreateProblem } from "../controllers/problem.controller.js"
import { UpdateProblem } from "../controllers/update.controller.js";
import { DeleteProblem } from "../controllers/delete.controller.js";
import { FetchProblem } from "../controllers/FetchProblem.controller.js";
import { FetchAllProblem } from "../controllers/FetchProblem.controller.js";
import { SolvedProblem } from "../controllers/solvedproblem.controller.js";
import { totalproblemsubmitted } from "../controllers/problemsubmitted.controller.js";
const problemrouter: Router = Router();


// CRUD operations by Admin on Problem

// Admin access is Required
problemrouter.post("/create", adminMiddleware, CreateProblem);
problemrouter.put("/update/:id", adminMiddleware, UpdateProblem);
problemrouter.delete("/delete/:id", adminMiddleware, DeleteProblem);

// Anyone can access
problemrouter.get("/fetchproblem/:id", authMiddleware, FetchProblem);
problemrouter.get("/fetchallproblem", authMiddleware, FetchAllProblem);
problemrouter.get("/user-problem", authMiddleware, SolvedProblem);
problemrouter.get("/:pid",authMiddleware,totalproblemsubmitted);

export default problemrouter;