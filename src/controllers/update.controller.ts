import type { Request, Response } from "express"
import type { RequestBody } from "./problem.controller.js"
import problem from "../models/problem.js"
import { languageId, submitBatch, submitToken } from "../utils/judge0.js"

interface Responsebody {
    message: string;
}


export const UpdateProblem = async (req: Request, res: Response<Responsebody>) => {

    const id = req.params.id;


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

        // let's update the data after we have checked it 
        // runvalidators isiliye kyunki update krte time woh schema check nahi krta h toh runvalidators:true krne se wapas schema check krega ki yeh correct format mein h yaa nahi aur new:true isiliye taaki jab bhi hum usse data maange updated document return krega .
        const id_there = await problem.findById(id);

        if (!id_there) {
            throw new Error("Problem Doesn't Exist");
        }

        const updated = await problem.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });

        if (!updated) throw new Error("Problem Not Found");


        res.status(200).send({ message: "Problem Updated" });


    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).send({
                message: error.message
            })
        }

    }



}