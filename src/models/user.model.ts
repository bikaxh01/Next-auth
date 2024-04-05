import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  username: {
    require: [true, "username is required"],
    type: String,
    unique: true,
  },
  email: {
    require: [true, "Email is required"],
    type: String,
    unique: true,
  },
  password: {
    require: [true, "password is required"],
    type: String,
  },
  isVerified: {
    default: false,
    type: Boolean,
  },
  isAdmin: {
    default: false,
    type: Boolean,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken:String,
  verifyTokenExpiry:Date
});

const user = mongoose.models.users || mongoose.model("users", userSchema);


export default user
