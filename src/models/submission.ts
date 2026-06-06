import mongoose, { Schema } from "mongoose";


type status = "pending" | "accepted" | "wrong" | " error";
type lang = "javascript" | "java" | "cpp" | "python";

interface ISubmit {

    language: lang,
    userId: mongoose.Types.ObjectId,
    problemId: mongoose.Types.ObjectId,
    runtime: number,
    errormessage: string,
    code: string,
    totaltestcases: number,
    totaltestpassed: number,
    memory: number,
    status: string,
    
}






const SubmissionSchema = new Schema<ISubmit>({


    language: {
        type: String,
        enum: ["javascript", "java", "cpp", "python"],
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "accepted", "wrong", "error"],
        default: "pending",
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "problem",
        required: true,
    },
    runtime: {
        type: Number,
        required: true,
        default: 0,
    },
    memory: {
        type: Number,
        required: true,
    },
    totaltestcases: {
        type: Number,
        required: true,
        default: 0,
    },
    errormessage: {
        type: String,
        required: true,
        default: "",
    },
    totaltestpassed: {
        type: Number,
        required: true,
        default: 0,
    },
    code: {
        type: String,
        required: true,
    }

}, {
    timestamps: true,
})


export const submission = mongoose.model<ISubmit>("submission", SubmissionSchema);
