import express from "express";
import { isAdminAuthenticated,isPatientAuthenticated} from "../middlewares/auth.js";
import { addNewAdmin, login,patientRegister,getAllDoctors,getUserDetails,logoutAdmin, logoutPatient,addNewDoctor} from "../controller/usercontroller.js";

const router = express.Router();

router.post("/patient/register", patientRegister);
router.post("/login", login);
router.post("/admin/addNewAdmin",isAdminAuthenticated, addNewAdmin);
router.get("/doctors", getAllDoctors);
router.get("/admin/me", isAdminAuthenticated,getUserDetails );
router.get("/patient/me",isPatientAuthenticated, getUserDetails );
router.get("/admin/logout", isAdminAuthenticated,logoutAdmin );
router.get("/patient/logout", isPatientAuthenticated,logoutPatient );
router.post("/doctor/addnew", addNewDoctor);
export default router;