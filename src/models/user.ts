import mongoose from "mongoose";
import { Schema } from "mongoose";

interface IUser {
    firstName: string;
    lastName?: string;
    emailId: string;
    age: number;
    role: "user" | "admin";
    problemSolved: string[];
    password:string;

}

// iska simply matlab h schema create kro toh IUser k structure follow krke hi create kro
const UserSchema = new Schema<IUser>({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20,
    },
    lastName: {
        type: String,
        minLength: 3,
        maxLength: 20,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        immutable: true,
    },
    age: {
        type: Number,
        min: 8,
        max: 80,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    problemSolved: {
        type: [String],
    },
    password:{
        type:String,
        required:true,
    }


}, { timestamps: true });

// Model "User" UserSchema follow karke banega.
// Aur TypeScript us model ke documents ko IUser ke according samjhega.
const User = mongoose.model<IUser>("user", UserSchema);

export default User;


// const UserSchema <IUser> meine pucha aisa kyun nahi likh skte h toh pta chla , invalid hai, kyunki variable declaration me variable name ke baad aise generic nahi lagate. ulta naya variable declare hone k baad Variable ka type annotate karna ho toh yeh symbol : use hota hai. isiliye nahi chlega yeh syntax
