import mongoose, { Schema } from "mongoose";

type ProblemTag = "array" | "Linkedlist" | "graph" | "dp";

interface IProblem {
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
    StartCode:{
        javascript:string,
        python:string,
        java:string,
    };
    createdby:mongoose.Schema.Types.ObjectId;

}

const problemSchema = new Schema<IProblem>({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        required: true,
    },
    tags: {
        type: [String],
        required: true,
        enum: ["array", "Linkedlist", "graph", "dp"],
        
    },
    VisibleTestCases: [{
        input: {
            type: String,
            required: true,
        },
        output: {
            type: String,
            required: true,
        },
        explanation: {
            type: String,
            required: true,
        }
    }],
    HiddenTestCases: [{
        input: {
            type: String,
            required: true,
        },
        output: {
            type: String,
            required: true,
        },
    }],
    StartCode: {
        javascript: {
            type: String,
            required: true,
        },
        python: {
            type: String,
            required: true,
        },
        java: {
            type: String,
            required: true,
        }
    },
    createdby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",//modelname
        required: true,
    }
});

const problem = mongoose.model<IProblem>("problem", problemSchema);

export default problem;
