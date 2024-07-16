import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        minLength: [3, "First name should contain at least 3 letters"]
    },
    lastname: {
        type: String,
        required: true,
        minLength: [3, "Last name should contain at least 3 letters"]
    },
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "Please provide a valid email"]
    },
    phone: {
        type: String,
        required: true,
        minLength: [10, "Phone number should contain exactly 10 digits"],
        maxLength: [10, "Phone number should contain exactly 10 digits"]
    },
    nic: {
        type: String,
        required: true,
        minLength: [10, "NIC should contain exactly 10 characters"],
        maxLength: [10, "NIC should contain exactly 10 characters"]
    },
    dob: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ["male", "female"]
    },
    appointment_date: {
        type: Date,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    doctor: {
        firstname: {
          type: String,
          required: [true, "Doctor Name Is Required!"],
        },
        lastname: {
          type: String,
          required: [true, "Doctor Name Is Required!"],
        },
      },
    hasVisited: {
        type: Boolean,
        default: false
    },
    doctorId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    patientId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected"],
        default: "Pending"
    }
});

export const Appointment = mongoose.model("Appointment", appointmentSchema);
