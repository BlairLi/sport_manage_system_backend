import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    sessionID: {
        type: Number,
        required: true,
    }, 
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        required: true,
    }, 
    lead: {
        type: String,
        required: true,
    },
    assistant1: {
        type: String,
        required: false,
    },
    assistant2: {
        type: String,
        required: false,
    },
});

// Add a virtual field for duration
sessionSchema.virtual('duration').get(function () {
    const startTime = this.startTime;
    const endTime = this.endTime;

    if (startTime && endTime) {
        const durationInMilliseconds = endTime - startTime;
        const durationInHours = durationInMilliseconds / (1000 * 60 * 60); // Convert milliseconds to hours
        return durationInHours;
    }
    return null;
});

// Ensure virtual fields are serialized
sessionSchema.set('toJSON', { virtuals: true });
sessionSchema.set('toObject', { virtuals: true });

const scheduleSchema= new mongoose.Schema({
    SrNo:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    }, 
    programName:{
        type:String,
        required:true
    },
    programID:{
        type:Number,
        required:true
    },
    startDay:{
            type:String,
            required:true
    },
    date:{
        type:String,
        required:true
    },
    nextSession:{
            type:String,
            required:true
    },
    confirmed:{
        type:Number,
        required:true
    },
    capacity:{
        type:Number,
        required:true
    },
    notes:{
        type:String,
        required:false
    },
    session: {
        type: [sessionSchema],
        required: false,
    }

},{timestamps:true})






const scheduleModel= mongoose.model('schedule',scheduleSchema)
const sessionModel= mongoose.model('session',sessionSchema)

export {scheduleModel, sessionModel}