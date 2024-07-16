import  {User}  from "../models/userschema.js";
import { catchAsyncErrors } from "./catchasync.js";
import Errorhandler from "./error.js";
import jwt from "jsonwebtoken";

export const isAdminAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.adminToken;
    if (!token) {
        return res.status(400).json({
            success: false,
         
            message: "Admin not authenticated",
          });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await User.findById(decoded.id);
        if (!req.user || req.user.role !== "admin") {
            return res.status(400).json({
                success: false,
             
                message: "User not authorized for this resource",
              });}
        next();
    } catch (error) {
        return res.status(400).json({
      success: false,
   
      message: "Invalid Token",
    });;
    }
});

export const isPatientAuthenticated = catchAsyncErrors(async (req, res, next) => {
    const token = req.cookies.patientToken;
    if (!token) {
        return res.status(400).json({
            success: false,
         
            message: "Patient not authenticated",
          });;
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await User.findById(decoded.id);
        if (!req.user || req.user.role !== "patient") {
            return res.status(400).json({
                success: false,
             
                message: "User not authorized for this resource",
              });
        }
        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
         
            message: "Invalid Token",
          });
    }
});
