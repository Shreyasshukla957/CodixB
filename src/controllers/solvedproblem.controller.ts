import type { Request, Response } from "express"
import User from "../models/user.js"
import problem from "../models/problem.js"

interface ResponseBody {
    message: string | object | string[]
}


export const SolvedProblem = async (req: Request, res: Response<ResponseBody>) => {

    try {

        const id = req.result.id;

        const psolved = await User.findById(id).populate({
            path: "problemSolved",
            select: "id title tags description difficulty"
        });
        // populate jaayega aur findybyId se document dhundhega uss particular user ka aur phir uss document mein se problemSolved key k andar ko ObjectId rakha h problem ka unn saare problem ka data le aayega from problem database because humne schema mein likha h ref="problem" toh ek tarah ka link h jisse populate ObjectId se data le aata h.

        if (!psolved) return res.status(404).send({ message: "User not found" });

        const solved_res = psolved.problemSolved

        res.status(200).send({
            message: solved_res as string[]
        });

    } catch (error) {

        if (error instanceof Error) {
            res.status(500).send({
                message: error.message,
            })
        }


    }

}

// waise jo populate se kaam kiya yeh same kaam hum submission.findbyid(user.id) krke bhi kr skte the saare jo user ne submit kiya h woh saare solved porblem mil jaate humein bina populate k