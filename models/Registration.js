import mongoose from "mongoose";

const registrationSchema= new mongoose.Schema({
    bookingID:{
        type:String,
        required:true
    },
    parentName:{
        type:String,
        required:true
    }, 
    childName:{
        type:String,
        required:true
    },
    childBirth:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    program:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    start:{
        type:String,
        required:true
    },
    end:{
        type:String,
        required:true
    },
    secondProgram:{
        type:String,
        required:false
    },
    secondAmount:{
        type:Number,
        required:false
    },
    secondStart:{
        type:String,
        required:false
    },
    makeupClasses:{
        type:String,
        required:true
    },
    notes:{
        type:String,
        required:false
    },


},{timestamps:true})


const registrationModel= mongoose.model('registration',registrationSchema)

export default registrationModel