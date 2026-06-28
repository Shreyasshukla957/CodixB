import User from "../models/user.js";
import checkvalidator from "../utils/validator.js";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import redisclient from "../config/redis.js";
import { submission } from "../models/submission.js";


interface Registerbody {
    firstName: string;
    emailId: string;
    password: string;
    role?: "user";
}

interface Responsebody {
    message: string;
    user?: object;
}


export const Register = async (req: Request<{}, {}, Registerbody>, res: Response<Responsebody>): Promise<void> => {

    try {

        checkvalidator(req.body);
        const { firstName, emailId, password, role } = req.body;
        req.body.password = await bcrypt.hash(password, 10);

        // yha par meine mention nahi kiya req.body se jo data aaya h woh admin h ya user kyunki agar yeh data user ne admin krke bhej diya toh usko extra power shayad mil jaaye. aagae dekhte h par iss point par dhyan dena padega , meine default krdiya agar koi
        // /user/Register se req krega toh woh automatically 
        // role : "user" bn jaayega.
        req.body.role = "user";
        const user = await User.create(req.body);

        const token = jwt.sign(
            { userid: user._id, emailId: emailId, role: "user" }, process.env.JWT_SKEY as string, { expiresIn: 3600 }
        );

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
            sameSite: "none",
            secure: true,
        })

        const result = {
            Id: user._id,
            emailId: user.emailId,
            firstName: user.firstName,
            role: user.role,
        };

        // sending user data to front-end for displaying it in UI
        res.status(200).json({
            user: result,
            message: "Registered Successful",
        });

    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).send({
                message: error.message,
            });
        }

    }

}


// TypeScript process.env.JWT_SECRET ko string | undefined maanta hai,
// kyunki env variable missing ho sakta hai.

// Isliye pehle check karo,
// phir use karo.


interface LoginBody {
    emailId: string;
    password: string;
    role?: "user" | "admin";
}

export const login = async (req: Request<{}, {}, LoginBody>, res: Response<Responsebody>): Promise<void> => {


    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId });

        if (!user) {
            throw new Error("User doesn't exist");
        }

        const checkpass = await bcrypt.compare(password, user.password);

        if (!checkpass) {
            throw new Error("Invalid Credential");
        }


        const token = jwt.sign(
            { userid: user._id, emailId: emailId, role: user.role }, process.env.JWT_SKEY as string, { expiresIn: 3600 }
        );

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
            sameSite: "none",
            secure: true,
        })

        const result = {

            Id: user._id,
            emailId: user.emailId,
            firstName: user.firstName,
            role: user.role,

        };

        // sending user data to front-end for displaying it in UI
        res.status(200).json({
            user: result,
            message: "Login Successful",
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).send({
                message: error.message,
            })
        }
    }



}

interface JwtDecoded {
    exp: number;
}


export const logout = async (req: Request, res: Response<Responsebody>): Promise<void> => {


    try {

        const { token } = req.cookies;
        const decoded = jwt.decode(token) as JwtDecoded;
        const currentTime: number = Math.floor(Date.now() / 1000);
        const expiresIn: number = decoded.exp - currentTime;

        await redisclient.set(`token:${token}`, "blocked", { EX: expiresIn });

        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "none",
            secure: true, //for https request 
        });

        res.status(200).send({ message: "Logged out successfully" });


    }
    catch (error) {

        if (error instanceof Error) {
            res.status(500).send({
                message: error.message
            })
        }

    }



}



interface AdminRegisterbody {
    firstName: string;
    emailId: string;
    password: string;
    role?: "admin";
}


export const AdminRegister = async (req: Request<{}, {}, AdminRegisterbody>, res: Response<Responsebody>): Promise<void> => {

    try {

        checkvalidator(req.body);
        const { firstName, emailId, password, role } = req.body;
        req.body.password = await bcrypt.hash(password, 10);

        req.body.role = "admin";
        const user = await User.create(req.body);

        const token = jwt.sign(
            { userid: user._id, emailId: emailId, role: "admin" }, process.env.JWT_SKEY as string, { expiresIn: 3600 }
        );

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
            sameSite: "none",
            secure: true,
        })

        res.status(201).send({
            message: "Registered Successfully"
        })

    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).send({
                message: error.message,
            });
        }

    }

}


export const deleteProfile = async (req: Request, res: Response) => {


    try {
        const id = req.result._id;

        // this will delete the profile of the user and also trigger the the userSchema.post and delete all of the submissions by this particular user.
        const userId = await User.findByIdAndDelete(id);


        res.status(200).send({
            message: "Deleted Successfully",
        })
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).send(
                {
                    message: error.message,
                }
            )
        }
    }



}


export const start = async (req: Request, res: Response) => {


    try {
        const data = req.result;

        const result = {
            Id: data._id,
            Emailid: data.emailId,
            firstName: data.firstName,
            role: data.role,
        }

        res.status(200).json({
            user: result,
            message: "Request accepted",
        })
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).send({
                mesaage: error.message,
            })
        }
    }


}