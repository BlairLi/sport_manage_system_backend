import {scheduleModel, sessionModel} from "../models/Schedule.js"
import Users from '../models/Users.js';

const createSchedule = async (req, res) => {
  try {
    const { SrNo, location, programName, programID, startDay, date, nextSession, confirmed, capacity, notes } = req.body
    const newSchedule = new scheduleModel({
      SrNo, location, programName, programID, startDay, date, nextSession, confirmed, capacity, notes
    })
    await newSchedule.save()

    res.status(200).json({ success: true, message: "Schedule Created Successfully.", newSchedule })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: "Interl server eror" })
  }
}

const getSchedule = async (req, res) => { 

  try {
    const schedule = await scheduleModel.find()
    if (!schedule) {
      return res.status(404).json({ success: false })
    }

    res.status(200).json({ schedule })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false })
  }

}

// TODO: update confirmed after parent has paid
const updateSchedule = async (req, res) => {
  try {
    const scheduleID = req.params.id;

    // Retrieve the current schedule data
    const currentSchedule = await scheduleModel.findById(scheduleID);
    if (!currentSchedule) {
      return res.status(404).json({ success: false, message: 'Schedule not found' });
    }

    // Filter out the fields with empty strings from req.body
    const filteredData = {};
    for (const key in req.body) {
      if (req.body[key] !== '') {
        filteredData[key] = req.body[key];
      }
    }

    // Merge current schedule data with the filtered new data from req.body
    const updatedData = { ...currentSchedule.toObject(), ...filteredData };

    // Update the schedule document
    const updatedSchedule = await scheduleModel.findByIdAndUpdate(scheduleID, updatedData, { new: true });
    if (!updatedSchedule) {
      return res.status(404).json({ success: false, message: 'Schedule not found' });
    }

    res.status(200).json({ success: true, message: 'Schedule updated successfully', updatedSchedule });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};



const deleteSchedule = async (req, res) => {
  try {
    const programID = req.params.id
    const deleteSchedule = await scheduleModel.findByIdAndDelete(programID)
    if (!deleteSchedule) {
      return res.status(404).json({ success: false, message: 'Schedule Not found' });
    }
    res.status(200).json({ success: true, message: 'Schedule Deleted successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}


const addSession = async (req, res) => {
  try {
    const scheduleId = req.params.id;
    const { sessionID ,startTime, endTime, location, lead, assistant1, assistant2 } = req.body;

    const schedule = await scheduleModel.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Schedule not found' });
    }

    const duration = (startTime - endTime) / (1000 * 60 * 60);

    const newSession = new sessionModel({
      sessionID,
      startTime,
      endTime,
      location,
      lead,
      assistant1,
      assistant2,
      duration
    });

    schedule.session.push(newSession);
    await schedule.save();

    // Update total working hours for lead coach
    await Users.findOneAndUpdate({ name: lead }, { $inc: { totalHours: duration } });

    // Update total working hours for assistant coaches
    if (assistant1) await Users.findOneAndUpdate({ name: assistant1 }, { $inc: { totalHours: duration } });
    if (assistant2) await Users.findOneAndUpdate({ name: assistant2 }, { $inc: { totalHours: duration } });

    res.status(200).json({ success: true, message: 'Session added successfully', schedule });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const deleteSession = async (req, res) => {
  try {
    const { scheduleId, sessionId } = req.params;

    const schedule = await scheduleModel.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Schedule not found' });
    }

    const session = schedule.session.id(sessionId);
    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    // Calculate session duration
    const duration = session.duration;

    // Update total working hours for lead coach
    await Users.findOneAndUpdate({ name: session.lead }, { $inc: { totalHours: -duration } });

    // Update total working hours for assistant coaches
    if (session.assistant1) await Users.findOneAndUpdate({ name: session.assistant1 }, { $inc: { totalHours: -duration } });
    if (session.assistant2) await Users.findOneAndUpdate({ name: session.assistant2 }, { $inc: { totalHours: -duration } });

    // Remove session from schedule
    schedule.session.pull({ _id: sessionId });
    await schedule.save();

    res.status(200).json({ success: true, message: 'Session deleted successfully', schedule });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getPersonSessionsDuration = async (req, res) => {
  try {
    const { personName } = req.query; // Assume person's name is passed as a query parameter

    const schedules = await scheduleModel.find({
      $or: [
        { "session.lead": personName },
        { "session.assistant1": personName },
        { "session.assistant2": personName }
      ]
    });

    if (!schedules || schedules.length === 0) {
      return res.status(404).json({ success: false, message: "No schedules found for the specified person" });
    }

    let totalDuration = 0;

    schedules.forEach(schedule => {
      schedule.session.forEach(session => {
        if (session.lead === personName || session.assistant1 === personName || session.assistant2 === personName) {
          totalDuration += session.duration
        }
      });
    });

    res.status(200).json({ success: true, totalDuration });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getSession = async (req, res) => {
  try {
    const scheduleId = req.params.id;
    const schedule = await scheduleModel.findById(scheduleId);
    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Schedule not found' });
    }
    res.status(200).json({ success: true, sessions: schedule.session });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


export { createSchedule, addSession, deleteSession, getSession, getSchedule, updateSchedule, deleteSchedule, getPersonSessionsDuration }



