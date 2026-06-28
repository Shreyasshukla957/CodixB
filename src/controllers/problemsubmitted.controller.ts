import type { Request, Response } from "express"
import { submission } from "../models/submission.js"
import mongoose from "mongoose"

interface ResponseBody {
    message: string | object[],
}



export const totalproblemsubmitted = async (req: Request, res: Response<ResponseBody>) => {


    try {
        const userId = req.result._id;
        // pid ko convert kiya h mongoose k objectId mein kyunki pid as a string mein find nahi kr paayega database se.
        const pid = new mongoose.Types.ObjectId(req.params.pid as string);

        const data = await submission.find({ userId, problemId: pid });

        if (data.length === 0) {
            throw new Error("Document Empty")
        }

        res.status(200).send({
            message: data,
        })
    }

    catch (error) {
        if (error instanceof Error) {
            res.status(500).send({
                message: error.message,
            })
        }

    }

}