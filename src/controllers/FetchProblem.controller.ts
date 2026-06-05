import type { Request, Response } from "express"
import problem from "../models/problem.js";



export const FetchProblem = async (req: Request, res: Response) => {

    try {

        const id = req.params.id;

        const foundproblem = await problem.findById(id);
        if (!foundproblem) {
            throw new Error("Problem Doesn't Exist")
        }

        res.status(200).send(foundproblem);

    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).send({
                message: error.message,
            })
        }

    }




}


export const FetchAllProblem = async (req: Request, res: Response) => {

    try {

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;



        const AllProblem = await problem.find({}).skip((page - 1) * limit).limit(limit);
    
        const total = await problem.countDocuments();
        // this is for checking that the db is not empty
        if(total === 0 ){
            throw new Error ("No data available");
        }

        res.status(200).send({ AllProblem, hasMore: page * limit < total });

    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).send({
                message: error.message,
            })
        }

    }

}



