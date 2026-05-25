import User from "../models/user.js";
import checkvalidator from "../utils/validator.js";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


interface Registerbody {
    firstName: string;
    emailId: string;
    password: string;
}

interface Responsebody {
    message: string;
}


export const Register = async (req: Request<{}, {}, Registerbody>, res: Response<Responsebody>): Promise<void> => {

    try {

        checkvalidator(req.body);
        const { firstName, emailId, password } = req.body;
        req.body.password = await bcrypt.hash(password, 10);

        // yha par meine mention nahi kiya req.body se jo data aaya h woh admin h ya user kyunki agar yeh data user ne admin krke bhej diya toh usko extra power shayad mil jaaye. aagae dekhte h par iss point par dhyan dena padega
        const user = await User.create(req.body);



        const token = jwt.sign(
            { userid: user._id, emailId: emailId }, process.env.JWT_SKEY as string, { expiresIn: 3600 }
        );

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
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


// TypeScript process.env.JWT_SECRET ko string | undefined maanta hai,
// kyunki env variable missing ho sakta hai.

// Isliye pehle check karo,
// phir use karo.


interface LoginBody {
    emailId: string;
    password: string;
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
            { userid: user._id, emailId: emailId }, process.env.JWT_SKEY as string, { expiresIn: 3600 }
        );

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 60 * 60 * 1000,
        })



        res.status(200).send({
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


// export const logout = async (req: Request, res: Response<Responsebody>): Promise<void> => {


//     try {
//         const { token } = req.cookies;





//     } 



// }



