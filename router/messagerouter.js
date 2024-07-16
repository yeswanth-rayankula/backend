import express from "express";
import  {sendmessage,getAllMessages} from "../controller/messageController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";
const router=express.Router();
router.post("/send",sendmessage);
router.get("/getall",isAdminAuthenticated,getAllMessages);
export default router;