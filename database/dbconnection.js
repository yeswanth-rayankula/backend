import mongoose from "mongoose";



export const dbconnection=()=>
    {
       
        mongoose.connect(process.env.MONGO_URI,{
            dbName:"HOSPITAL"
        }).catch((err)=>{
    
             console.log("error data base",err);
        })
    }