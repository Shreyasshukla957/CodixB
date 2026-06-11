import validator from "validator"

interface Registerbody {
    firstName: string;
    emailId: string;
    password: string;
}

// Partial<RegisterBody> isliye use kiya hai kyunki req.body external/client data hai.
// Hume 100% sure nahi hota ki client ne RegisterBody ke saare required fields bheje hain.
// Example: client sirf firstName bhej sakta hai, emailId/password missing ho sakte hain.
// Partial ka matlab hai data RegisterBody jaisa ho sakta hai, but uske fields optional ho sakte hain.
// Iske baad hum manually mandatory fields check karte hain.
// Agar koi important field missing hai, toh validation error throw kar dete hain.

// Partial<Registerbody> ko aisa smjh sakte h
// interface PartialRegisterbody {
//     firstName?:string;
//     emailId?:string;
//     password?:string;
// }

const checkvalidator = (data: Partial<Registerbody>):void => {

    const mandatoryField : Array<keyof Registerbody> = ["firstName", "emailId", "password"];

    const check: boolean = mandatoryField.every((k) => Object.keys(data).includes(k));

    if (!check) {
        throw new Error("Missing Important Field");
    }

    if(typeof data.firstName !== "string" || !validator.isLength(data.firstName,{min:3,max:20})){
        throw new Error("Firstname is not valid");
    }

    // by mistake i flipped the logic of validator.isStrongPassword throwing error if the password is strong but as we know that if the password is strong it returns true . so i should use !validator.isStrongPassword()
    if(typeof data.password !== "string" || !validator.isStrongPassword(data.password,{
        minLength:8,
        minLowercase:1,
        minUppercase:1,
        minNumbers:1,
        minSymbols:2,
    })){
        throw new Error ("Password must contain UpperCase , LowerCase , Number and Special Symbol");
    }
}

export default checkvalidator;