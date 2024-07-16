import { catchAsyncErrors } from "../middlewares/catchasync.js";
import Errorhandler from "../middlewares/error.js";
import { Message } from "../models/messageSchema.js";
import validator from "validator";

export const sendmessage = catchAsyncErrors(async (req, res, next) => {
  const { firstname, lastname, email, phone, message } = req.body;
  if(!validator.isEmail(email))
    {
      return  res.status(400).json({
        success: false,
        message: "Invalid mail",
      });
    }
 
  await Message.create({ firstname, lastname, email, phone, message });
  res.status(200).json({
    success: true,
    message: "Message Sent!",
  });
});

export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
  const messages = await Message.find();
  res.status(200).json({
    success: true,
    messages,
  });
});
