import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import { dbconnection } from "./database/dbconnection.js";
import messagerouter from "./router/messagerouter.js";

import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";
const app=express();

config({path:"./config/config.env"})

app.use(
    cors({
       origin:[process.env.frontend_url,process.env.dashboard_url],
       methods:["GET","POST","PUT","DELETE"],
       credentials:true

    })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(
    fileUpload({
       useTempFiles:true,
       tempFileDir:"/tmp/"
     })
)

app.get("/",(req,res)=>{
    res.send("deploy success");
})
app.use("/api/v1/message",messagerouter);
app.use("/api/v1/user",userRouter);
app.use("/api/v1/appointment",appointmentRouter);
dbconnection();

export default app;