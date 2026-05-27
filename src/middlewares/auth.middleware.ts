import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

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

        // jwt.verify ka return type broad hota hai: string ya object dono ho sakta hai.
        // Token banate time humne payload me { userId: ... } dala tha.
        // Isliye decoded ko AuthTokenPayload type dete hain taaki decoded.userId safely use kar sakein.
        const decoded = jwt.verify(token, process.env.JWT_SKEY as string) as jwtPayload

        if (!decoded) {
            throw new Error("Not Authorized");
        }
        next();
    }

    catch(error){
        if(error instanceof Error){
            res.status(401).send({
                message:"Unauthorized Access"
            });
        }
    }




}