import mongoose from "mongoose";
import validator from "validator";

const messageschema = new mongoose.Schema({
    firstname:{
         type:String,
         required:true,
         minLength:[3,"first name contains atleast 3 letters"]
    },
    lastname:{
        type:String,
        required:true,
        minLength:[3,"last name contains atleast 3 letters"]
    },
    email:{
        type:String,
        required:true,
        validate:[validator.isEmail,"please provide valid email"]
    },
    phone:{
        type:String,
        required:true,
        minLength:[10,"phone number contains atleast 10 letters"]
    },
    message:{
        type:String,
        required:true,
        minLength:[3,"message contains atleast 3 words"]
    }
});

export const Message = mongoose.model("message",messageschema)