import type { Request, Response } from "express"
import problem from "../models/problem.js"
import mongoose from "mongoose";
import { submitBatch, submitToken } from "../utils/judge0.js";
import { languageId } from "../utils/judge0.js";
import { submission } from "../models/submission.js";
import User from "../models/user.js";



type status = "pending" | "accepted" | "wrong" | " error";
type lang = "javascript" | "java" | "cpp" | "python";



interface ISubmit {
    language: lang,
    code: string,
    status: string,
    totaltestpassed: number,
    totaltestcases: number,

}

interface Judge0Submission {
    source_code: string;
    language_id: number;
    stdin: string;
    expected_output: string;
}



export const usersubmission = async (req: Request, res: Response) => {

    try {

        const { language, code, totaltestpassed, status, totaltestcases } = req.body as ISubmit;
        const userId = req.result!._id;
        const problemId = req.params.id as string;

        if (!userId || !problemId || !language || !code) {
            throw new Error("Incomplete Credential");
        }

        const getproblem = await problem.findById(problemId);

        if (!getproblem) return res.status(404).json({ error: "Not found" });


        const { referencesolution, VisibleTestCases } = getproblem;

        // db mein code store kradeneg from front-end
        const str_problem = await submission.create({
            language,
            code,
            userId,
            problemId,
            totaltestpassed,
            status: "pending",
            totaltestcases: getproblem.HiddenTestCases.length,
        });


        // ab code ko language id deni h

        const langid = languageId(language);
        const submissions: Judge0Submission[] = getproblem.HiddenTestCases.map(({ input, output }) => ({
            source_code: code,
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
        // testResult ek [] format mein rehta h jiske andar k ans [{},{},{}] iss format mein rehte h.

        let errormessage = "";
        let memory = 0;
        let isstatus = "";
        let runtime = 0;
        let testpassed = 0;


        for (let element of testResult) {
            if (element.status_id === 3) {
                isstatus = "accepted";
                testpassed = testpassed + 1;
                runtime = runtime + parseFloat(element.time);
                memory = memory + Math.max(element.memory);

            }
            else if (element.status_id < 3) {
                errormessage = element.errormessage;
                isstatus = "error";
                errormessage = element.stderr;
            }
            else {
                isstatus = "wrong";
            }
        }

        str_problem.errormessage = errormessage;
        str_problem.status = isstatus;
        str_problem.memory = memory;
        str_problem.totaltestpassed = testpassed;
        str_problem.runtime = runtime;

        await str_problem.save();


        // ab humein yha par important thing yaaad krna h , humne problemsoled krke ek field bnaya tha userSchema mein taaki jo bhi problemsolve kre uska naam/id humein store krana h taaki pata rhe kitna problem ek user ne solve kiya h .
        // toh uske liye hum yeh krna h ki jaise hi submission ho jaaye humein woh problem store kradena h userSchema mein jo submit krdiya h par uske liye problemid chahiye yaa problemname toh hi problemsaved[problemid] aise store kra skte h . isk solution h jab hum submission krte h toh submissionschema mein problemid aur userid dono h toh waha se utha skte h problemid.

        // phele check krenge ki problemid unique ho matlab woh problemid pehle se hi exist naa krti ho problemsaved mein warna duplicacy ho jaayegi jo hum nahi chahte h .

        if (isstatus === "accepted" && !req.result.problemSolved.includes(problemId)) {
            req.result.problemSolved.push(problemId);
            await req.result.save();
        }


        res.status(200).json({
           totaltestpassed:str_problem.totaltestpassed,
           totaltestcases:getproblem.HiddenTestCases.length,
           runtime,
           memory,
           isstatus,

        });




    } catch (error) {
        if (error instanceof Error) {
            res.status(400).send({
                message: error.message,
            })
        }

    }

}


// ab approach yeh h ki hum pehle jo bhi data aaya h usse db mein store kradenge with "pending" status
// phir hum uss data ko uthakar judge0 k pass bhejdenge aur phir woh jo data dega usse lenge aur apne db mein jaakar update krdenge 
// pehle db mein phir judege0 aur uske baad wapas db update , aur iska reason h pehli baat humara goal clear h ki humein jo bhi data aaye front-end se usse store krana h kyunki agar direct judge0 ko denge ho skta h kuch dikkat k wajah se judge0 kuch return hi na kre toh data udd jaayega aur hum usse db mein store bhi nahi kra paayenge isiliye best tareeka h bhale hi abhi humein nahi pata data jo aaya h front-end se correct h ya nahi store krado aur phir check kralo sahi h toh update status krdenge db mein "accpeted" agar galat raha toh "wrong" .



export const Runcode = async (req: Request, res: Response) => {

    try {


        const { language, code } = req.body as ISubmit;
        const userId = req.result!._id;
        const problemId = req.params.id as string;

        if (!userId || !problemId || !language || !code) {
            throw new Error("Incomplete Credential");
        }

        const getproblem = await problem.findById(problemId);

        if (!getproblem) return res.status(404).json({ error: "Not found" });


        const { referencesolution, VisibleTestCases } = getproblem;



        // ab code ko language id deni h

        const langid = languageId(language);
        const submissions: Judge0Submission[] = getproblem.VisibleTestCases.map(({ input, output }) => ({
            source_code: code,
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

        res.status(200).send({
            testResult,
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