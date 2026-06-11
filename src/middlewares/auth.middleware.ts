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
}



export const authMiddleware = async (req: Request, res: Response<AuthResponse>, next: NextFunction): Promise<void> => {

    try {


        const cookies = req.cookies as AuthCookies;
        const { token } = cookies;

        if (!token) {
            res.status(401).send({
                message: "Unauthorized",
            });
            return;//stop krdega function yhi par

        }

        // if token will exist in redis it will give string "blocked" as ans and if not it will give null.
        const blocked = await redisclient.get(`token:${token}`)

        // if we get const blocked = "blocked" from redisclient.get we will send res as unauthorized token because it is blocked .
        if (blocked) {
            res.status(401).send({
                message: "Unauthorized"
            });
            return;
        }


        // jwt.verify ka return type broad hota hai: string ya object dono ho sakta hai.
        // Token banate time humne payload me { userid: ... } dala tha.
        // Isliye decoded ko AuthTokenPayload type dete hain taaki decoded.userId safely use kar sakein.
        const decoded = jwt.verify(token, process.env.JWT_SKEY as string) as jwtPayload

        if (!decoded) {
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