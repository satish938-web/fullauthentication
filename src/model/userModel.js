import mongoose, { Schema } from "mongoose";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    emailVerified:{
        type:Boolean,
        default:false
    },
    verificationToken:String,
    verificationTokenExpires:Date,

    // OTP (2FA)
    otp:String,
    otpExpires:Date,
    
    twoFactor:{
        type:Boolean,
        default:false
    },
    role:{
   type:Schema.Types.ObjectId,
   ref:"Role"
    }
});

export const User = mongoose.model("User", userSchema)

