import type { Request, Response } from "express";
import problem from "../models/problem.js";
import { languageId, submitBatch, submitToken } from "../utils/judge0.js";


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

            const testResult = await submitToken(resulttoken);

            for (const element of testResult){
                 if(element.status_id!==3){
                     res.status(400).send({
                        message:"Error Occured",
                    })
                return;
                }
            }

        } 

    }
    catch(error) {
            if (error instanceof Error) {
                res.send({
                    message:error.message
                })
            }

        }

    }