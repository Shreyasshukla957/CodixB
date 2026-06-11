import type { Request, Response } from "express"
import { submission } from "../models/submission.js"

interface ResponseBody {
    message: string | object[],
}



export const totalproblemsubmitted = async (req: Request, res: Response<ResponseBody>) => {


    try {
        const userId = req.result._id;
        const pid = req.params.id;

        const data = await submission.find({ userId, pid });

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