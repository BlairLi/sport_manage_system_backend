// Program.js

import mongoose from "mongoose";

const ProgramSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    required: true
  },
  place: {
    type: String,
    required: true
  },
  fees: {
    type: Number,
    required: true
  },
  age: {
    type: String,
    required: true
  },
  sport: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  }
});

const ProgramModel = mongoose.model("programs", ProgramSchema);

export default ProgramModel

