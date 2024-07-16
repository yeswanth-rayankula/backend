import app from "./app.js";
import cloudinary from "cloudinary";

cloudinary.v2.config({
     cloud_name: process.env.cloudinary_cloud_name,
     api_key:process.env.cloudinary_api_key,
     api_secret:process.env.cloudinary_api_secret,

})

const port = process.env.PORT ; 
app.listen(port);
