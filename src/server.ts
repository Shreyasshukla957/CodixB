import express from "express"
const app = express();
import "dotenv/config";
import type { Request, Response } from "express";
import { main } from "./config/mgdb.js";
import cookieParser from "cookie-parser";
import User from "./models/user.js";
import authRouter from "./routes/user.auth.js";
import { connectRedis } from "./config/redis.js";
import adminRouter from "./routes/admin.auth.js";
import problemrouter from "./routes/problem.routes.js";
import { submitrouter } from "./routes/submit.routes.js";
import { runrouter } from "./routes/run.route.js";
import cors from "cors"


app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use("/user", authRouter);
app.use("/admin", adminRouter);
app.use("/problem", problemrouter);
app.use("/submit", submitrouter);
app.use("/run", runrouter);



async function start(): Promise<void> {

    try {
        await Promise.all([main(), connectRedis()]);
        console.log("Connection established with DB");
        app.listen(process.env.PORT || 4000, () => {
            console.log("listening at port no " + process.env.PORT);
        })

    }
    catch (err) {
        // TypeScript catch ke err ko unknown maanta hai, isliye pehle check karte hain ki ye JavaScript ka Error object hai ya nahi.
        // Agar err instanceof Error true hua, toh TypeScript samajh jaata hai ki ye JS wala familiar Error hai jiska type mujhe pata hai.
        // Isliye TypeScript err.message allow kar deta hai, kyunki JS Error object me message property hoti hai. 
        if (err instanceof Error) {
            console.log(err.message);
        }
        else {
            console.log(err);
        }
    }



}

start();


