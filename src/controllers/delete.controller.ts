import type { Request, Response } from "express"
import problem from "../models/problem.js"

interface Responsebody {
    message: string;
}


export const DeleteProblem = async (req: Request, res: Response<Responsebody>) => {


    const id = req.params.id;


    try {

        const id_there = await problem.findById(id);

        if (!id_there) {
            throw new Error("Problem Doesn't Exist");
        }

        const deleted = await problem.findByIdAndDelete(id);

        if (!deleted) throw new Error("Problem Not Found");


        res.status(200).send({ message: "Problem Deleted" });


    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).send({
                message: error.message
            })
        }

    }



}