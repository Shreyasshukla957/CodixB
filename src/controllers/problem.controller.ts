import type { Request, Response } from "express";
import problem from "../models/problem.js";
import { languageId, submitBatch, submitToken } from "../utils/judge0.js";
import type { CustomRequest } from "../middlewares/admin.middleware.js";


type ProblemTag = "array" | "Linkedlist" | "graph" | "dp";

export interface RequestBody {
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
        cpp: string,
    };
    referencesolution: {
        javascript: string,
        python: string,
        java: string,
        cpp: string,
    };

}

interface Responsebody {
    message: string;
}



export const CreateProblem = async (req: CustomRequest, res: Response<Responsebody>): Promise<void> => {

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
        } = req.body as RequestBody

        type languageis = "javascript" | "python" | "java" | "cpp";

        interface Judge0Submission {
            source_code: string;
            language_id: number;
            stdin: string;
            expected_output: string;
        }


        for (const language in referencesolution) {
            const langid = languageId(language);
            const submissions: Judge0Submission[] = VisibleTestCases.map(({ input, output }) => ({
                source_code: referencesolution[language as languageis],
                language_id: langid,
                stdin: input,
                expected_output: output,
            }));

            const submitResult = await submitBatch(submissions);

            interface SubmitResult {
                token: string;
            };

            const resulttoken = submitResult.map((element: SubmitResult) => {
                return element.token;
            })

            console.log(resulttoken);

            const testResult = await submitToken(resulttoken);

            // here we can create a object for status id and it's error , something like this .
            // {
                // 1:"in  queue",
                // 2:"processing",
                // 3:"Accepted",
                // 4:"wrong ans",
                // 5,6,7,8,---14.
            // }

            console.log(testResult);
            for (const element of testResult) {
                if (element.status_id !== 3) {
                    res.status(400).send({
                        message: "Error Occured",
                    })
                    return;
                }
            }

        }


        // Let's store it in our DB once the ans in correct 

      const userProblem = await problem.create({
           ...req.body as RequestBody,
           createdby: req.result!._id,
        })

        res.status(200).send({
            message:"Problem Saved",
        })

    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).send({
                message: error.message
            })
        }

    }

}

