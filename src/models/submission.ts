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
        default: 0,
    },
    memory: {
        type: Number,
        default: 0,
    },
    totaltestcases: {
        type: Number,
        required: true,
        default: 0,
    },
    errormessage: {
        type: String,
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


// Compound index on userId + pid:
// Speeds up queries like submission.find({ userId, pid })
// Similar to how MongoDB auto-indexes _id for fast lookups
SubmissionSchema.index({ userId: 1, problemId: 1 })


export const submission = mongoose.model<ISubmit>("submission", SubmissionSchema);
