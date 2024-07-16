import { catchAsyncErrors } from "../middlewares/catchasync.js";
import Errorhandler from "../middlewares/error.js";
import { Appointment } from "../models/appointmentSchema.js";
import  {User}  from "../models/userschema.js";
import validator from "validator";
export const postAppointment = catchAsyncErrors(async (req, res, next) => {
  const {
    firstname,
    lastname,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor_firstname,
    doctor_lastname,
    hasVisited,
    address,
  } = req.body;
  if (
    !firstname ||
    !lastname ||
    !email ||
    !phone ||
    !nic ||
    !dob ||
    !gender ||
    !appointment_date ||
    !department ||
    !doctor_firstname ||
    !doctor_lastname ||
    !address
  ) {
      return res.status(400).json({
      success: false,
   
      message: "Please fill full form!",
    });
  }
  if(!validator.isEmail(email))
    return res.status(400).json({
      success: false,
   
      message: "Incorrect Email!",
    });
  const isConflict = await User.find({
    firstname: doctor_firstname,
    lastname: doctor_lastname,
    role: "doctor",
    doctorDepartment: department,
  });
  if (isConflict.length === 0) {
    return next(new Errorhandler("Doctor not found", 404));
  }

  if (isConflict.length > 1) {
    return next(
      new Errorhandler(
        "Doctors Conflict! Please Contact Through Email Or Phone!",
        400
      )
    );
  }
  
  const doctorId = isConflict[0]._id;
  const patientId = req.user._id;
  const appointment = await Appointment.create({
    firstname,
    lastname,
    email,
    phone,
    nic,
    dob,
    gender,
    appointment_date,
    department,
    doctor: {
      firstname: doctor_firstname,
      lastname: doctor_lastname,
    },
    hasVisited,
    address,
    doctorId,
    patientId,
  });
  res.status(200).json({
    success: true,
    appointment,
    message: "Appointment Send!",
  });
});

export const getAllAppointments = catchAsyncErrors(async (req, res, next) => {
  const appointments = await Appointment.find();
  
  res.status(200).json({
    success: true,
    appointments,
  });
});
export const updateAppointmentStatus = catchAsyncErrors(
  async (req, res, next) => {
    const { id } = req.params;
    let appointment = await Appointment.findById(id);
    if (!appointment) {
      return next(new Errorhandler("Appointment not found!", 404));
    }
    appointment = await Appointment.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    res.status(200).json({
      success: true,
      message: "Appointment Status Updated!",
    });
  }
);
export const deleteAppointment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  console.log("id");
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new Errorhandler('Invalid appointment ID', 400));
  }

  const appointment = await Appointment.findById(id);
  if (!appointment) {
    return next(new Errorhandler('Appointment not found', 404));
  }

  await appointment.deleteOne();
  res.status(200).json({
    success: true,
    message: 'Appointment deleted successfully',
  });
});

