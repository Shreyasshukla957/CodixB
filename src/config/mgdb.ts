import mongoose from "mongoose";

export async function main(): Promise<void> {

    const Dbconnect = process.env.DB_CONNECT;

    // TypeScript process.env.DB_CONNECT ko hamesha string | undefined maanta hai, kyunki .env me value missing bhi ho sakti hai.
    // Mongoose connect ke liye pakka string chahiye, isliye pehle check karte hain ki dbConnect ki value present hai ya nahi.
    // Agar value undefined hui to clear error throw kar dete hain, warna TypeScript samajh jaata hai ki dbConnect ab pakka string hai.

    if (!Dbconnect) {
        throw new Error("Dbconnect is undefined");
    }

    await mongoose.connect(Dbconnect);
}

