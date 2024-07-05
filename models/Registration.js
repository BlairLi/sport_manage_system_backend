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
    email:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    child1Name:{
        type:String,
        required:true
    },
    child1Birth:{
        type:String,
        required:true
    },
    child1Program:{
        type:String,
        required:true
    },
    child1Amount:{
        type:Number,
        required:true
    },
    child1Start:{
        type:String,
        required:true
    },
    child1End:{
        type:String,
        required:true
    },
    child1Program2:{
        type:String,
        required:false
    },
    child1Amount2:{
        type:Number,
        required:false
    },
    child1Start2:{
        type:String,
        required:false
    },
    child1End2:{
        type:String,
        required:false
    },
    child2Name:{
        type:String,
        required:false
    },
    child2Birth:{
        type:String,
        required:false
    },
    child2Program:{
        type:String,
        required:false
    },
    child2Amount:{
        type:Number,
        required:false
    },
    child2Start:{
        type:String,
        required:false
    },
    child2End:{
        type:String,
        required:false
    },
    makeupClasses:{
        type:String,
        required:false
    },
    notes:{
        type:String,
        required:false
    },


},{timestamps:true})


const registrationModel= mongoose.model('registration',registrationSchema)

export default registrationModel