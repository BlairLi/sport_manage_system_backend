import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true // Ensures the name field is required
  },  
  location: {
    type: String,
    required: true // Ensures the location field is required
  },
  email: {
    type: String,
    required: true // Ensures the email field is required
  },
  phone: {
    type: Number,
    required: true, // Ensures the age field is required
  },
  hour:{
    type:Number,
    required:true
    },
  hourlyWage:{
      type:Number,
      required:true
  },
  totalSalary:{
      type:Number,
      required:true
  },
  gender: {
    type: String,
    required: true // Ensures the email field is required
  }
  
});

const UserModel = mongoose.model("users", UserSchema);
// module.exports = UserModel;
export default UserModel;