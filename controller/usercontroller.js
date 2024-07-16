import { catchAsyncErrors } from "../middlewares/catchasync.js";
import Errorhandler from "../middlewares/error.js";
import {User} from "../models/userschema.js";
import { generateToken } from "../utils/jwtToken.js";
import cloudinary from "cloudinary";
import validator from "validator";


export const patientRegister = catchAsyncErrors(async (req, res, next) => {
  const { firstname, lastname, email, phone, password, gender, dob, nic, role } = req.body;
  if (!firstname || !lastname || !email || !phone || !password || !gender || !dob || !role) {
    return res.status(400).json({
      status:false,
      message:"Please fill full form",
  }) 
  }
  
  if(!validator.isEmail(email))
    return res.status(400).json({
      success: false,
       message: "Incorrect Email!",
    });
  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({
      status:false,
      message:"User with this mail registered already",
  }) 
  }

  user = await User.create({
    firstname,
    lastname,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role
  });

  
  generateToken(user, "user registered", 200, res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, confirmPassword, role } = req.body;
  if (!email || !password || !confirmPassword || !role) {
    return res.status(400).json({
      status:false,
      message:"Fill full form",
  }) 
  }
  if (password !== confirmPassword) {
    return res.status(400).json({
      status:false,
      message:"Password and confirm password do not match",
  }) 
  }
  const user = await User.findOne({ email }).select("+password");
  console.log();
  if (!user) {
    return res.status(400).json({
      status:false,
      message:"Invalid email or password",
  }) 
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    return res.status(400).json({
      status:false,
      message:"Invalid email or password",
  }) 
  }
  if (role !== user.role) {
    return res.status(400).json({
      status:false,
      message:"User not found with this role",
  }) 
  }
  generateToken(user, "Login Successfully!", 201, res);
});
export const addNewAdmin=(async(req,res,next)=>{
  const { firstname, lastname, email, phone, password, gender, dob, nic, role } = req.body;
  if (!firstname || !lastname || !email || !phone || !password || !gender || !dob || !role) {
    return res.status(400).json({
      status:false,
      message:"please fill full form",
  }) 
  }
  
  const isRegistered=await User.findOne({email});
  if(isRegistered)
  {
    return res.status(400).json({
      status:false,
      message:"Admin mail registered already",
  }) 
  }
  const admin=await User.create({firstname, lastname, email, phone, password, gender, dob, nic, role:"admin"});
  res.status(200).json({
      status:true,
      message:"new admin register succesful",
  })
});

export const getAllDoctors=(async(req,res,next)=>{
  
    const doctors=await User.find({role:"doctor"});
    
    res.status(200).json({
        success:true,
        doctors,
    })
});

export const getUserDetails = catchAsyncErrors (async (req, res, next)=>{
     const user = req.user;
     res.status(200).json({
         success: true,
         user,
     })
});
export const logoutAdmin = catchAsyncErrors(async (req, res, next) => {
 res
  .status(200)
  .cookie("adminToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
      secure:true,
      sameSite:"None"
   })
  .json({
       success: true,
       message: "User Log Out Successfully!",
  });
});
export const logoutPatient = catchAsyncErrors(async (req, res, next) => {
  res
   .status(200)
   .cookie("patientToken", "", {
       httpOnly: true,
       expires: new Date(Date.now()),
       secure:true,
       sameSite:"None"
    })
   .json({
        success: true,
        message: "User Log Out Successfully!",
   });
 });


 export const addNewDoctor = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return    res.status(400).json({
      success:false,
      message:"Doctor Avatar required"
 })
  }
  const { docAvatar } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(docAvatar.mimetype)) {
    return res.status(400).json({
      success:false,
      message:"File format not supported"
 })
  }
  const {
    firstname,
    lastname,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    doctorDepartment,
  } = req.body;
  if (
    !firstname ||
    !lastname ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !password ||
    !doctorDepartment ||
    !docAvatar
  ) {
    return  res.status(400).json({
      success:false,
      message:"Please fill full form"
 })
  }

  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    return res.status(400).json({
         success:false,
         message:"User with this mail already exists"
    })
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    docAvatar.tempFilePath
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
    return  res.status(400).json({
         success:false,
         message:"Failed to upload"
    })
  }
  const doctor = await User.create({
    firstname,
    lastname,
    email,
    phone,
    nic,
    dob,
    gender,
    password,
    role: "doctor",
    doctorDepartment,
    docAvatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    message: "New Doctor Registered",
    doctor,
  });
});

