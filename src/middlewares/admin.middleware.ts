import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import redisclient from "../config/redis.js";
import User from "../models/user.js";

interface AuthCookies {
    token?: string;
}

interface AuthResponse {
    message: string;
}

interface jwtPayload {
    userid: string;
    role: "admin"
}

// Customrequest = Request k types + result ka type


export const adminMiddleware = async (req: Request, res: Response<AuthResponse>, next: NextFunction): Promise<void> => {

    try {


        const cookies = req.cookies as AuthCookies;
        const { token } = cookies;

        if (!token) {
            res.status(401).send({
                message: "Unauthorized",
            });
            return;//stop krdega function yhi par

        }

        const blocked = await redisclient.get(`token:${token}`)

        if (blocked) {
            res.status(401).send({
                message: "Unauthorized Blocked"
            });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SKEY as string) as jwtPayload

        if (!decoded) {
            throw new Error("Not Authorized");
            
        }

        if (decoded.role !== "admin") {
            throw new Error("Not Authorized");  
        }

        const result = await User.findById(decoded.userid);

        if (!result)
            throw new Error("User Doesn't Exist");

        req.result = result;

        next();
    }

    catch (error) {
        if (error instanceof Error) {
            res.status(401).send({
                message: "Unauthorized Access"
            });
        }
    }




}