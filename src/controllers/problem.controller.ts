import type { Request, Response } from "express";
import problem from "../models/problem.js";
import { languageId } from "../utils/judge0.js";

type ProblemTag = "array" | "Linkedlist" | "graph" | "dp";

interface RequestBody {
    title: string;
    description: string;
    difficulty: "easy" | "medium" | "hard";
    tags: ProblemTag[];
    VisibleTestCases: {
        input: string,
        output: string,
        explanation?: string
    }[];
    HiddenTestCases: {
        input: string,
        output: string,
    }[];
    StartCode: {
        javascript: string,
        python: string,
        java: string,
        cpp:string,
    };
    referencesolution: {
        javascript: string,
        python: string,
        java: string,
        cpp:string,
    };

}

interface Responsebody {
    message: string;
}






export const CreateProblem = async (req: Request<{}, {}, RequestBody>, res: Response<Responsebody>): Promise<void> => {

    try {

        const {
            title,
            description,
            difficulty,
            tags,
            VisibleTestCases,
            HiddenTestCases,
            StartCode,
            referencesolution
        } = req.body

        for(const language in referencesolution){
            const langid = languageId(language);
        }

















    } catch (error) {
        if (error instanceof Error) {

        }

    }

}