import registrationModel from "../models/Registration.js"
import { scheduleModel } from "../models/Schedule.js"
import sendMail from "../utlis/email.js"

const createRegistration = async (req, res) => {
  try {
    const { bookingID, parentName, email, phone, child1Name, child1Birth, child1Program, child1ProgramPlace, childDayOfClassTime, child1Amount, child1Start, child1End, child1Program2, child1Amount2, child1Start2, child1End2, child2Name, child2Birth, child2Program, child2Amount, child2Start, child2End, makeupClasses, notes } = req.body;

    // Check for capacity of the program
    const schedule = await scheduleModel.find({ programName: { $in: [child1Program, child1Program2] } });
    for (const sched of schedule) {
      if (sched.confirmed >= sched.capacity) {
        return res.status(400).json({ success: false, message: `Capacity reached for program: ${sched.programName}` });
      }
    }

    // If capacity not reached, proceed to create new registration
    const newRegistration = new registrationModel({
      bookingID, parentName, email, phone, child1Name, child1Birth, child1Program, child1ProgramPlace, childDayOfClassTime, child1Amount, child1Start, child1End, child1Program2, child1Amount2, child1Start2, child1End2, child2Name, child2Birth, child2Program, child2Amount, child2Start, child2End, makeupClasses, notes
    });
    await newRegistration.save();

    res.status(200).json({ success: true, message: "Registration Created Successfully.", newRegistration });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getRegistration = async (req, res) => {

  try {
    const registration = await registrationModel.find()
    if (!registration) {
      return res.status(404).json({ success: false })
    }

    res.status(200).json({ registration })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false })
  }

}

// TODO: finish update registration
const updateRegistration = async (req, res) => {
  try {
    const bookingID = req.params.id;

    // Retrieve the current Registration data
    const currentRegistration = await registrationModel.findOne({ bookingID });

    if (!currentRegistration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    // Filter out the fields with empty strings from req.body
    const filteredData = {};
    for (const key in req.body) {
      if (req.body[key] !== '') {
        filteredData[key] = req.body[key];
      }
    }

    // Merge current Registration data with the filtered new data from req.body
    const updatedData = { ...currentRegistration.toObject(), ...filteredData };

    // Update the Registration document
    const updatedRegistration = await registrationModel.findOneAndUpdate(
      { bookingID },
      updatedData,
      { new: true }
    );

    if (!updatedRegistration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    // Send notification email
    const { parentName, email, child1Start, childDayOfClassTime, child1ProgramPlace } = updatedRegistration;
    const emailSubject = 'Confirmation of Basketball Training Session with Junior Athletics';
    const emailHTML = `
      <p style="color: #000000;">Dear ${parentName},</p>
      <p style="color: #000000;">Thank you for registering your child for basketball training with Junior Athletics. We are thrilled to have them join us!</p>
      <p style="color: #000000;">Below are the details for your child's upcoming session:</p>
      <p style="color: #000000;"><strong>Date:</strong> ${child1Start}<br>
        <strong>Time:</strong> ${childDayOfClassTime}<br>
        <strong>Location:</strong> ${child1ProgramPlace}</p>
      <p style="color: #000000;">Please ensure that your child wears sneakers and brings a water bottle.</p>
      <p style="color: #000000;">If you refer a friend to our basketball training program, you will receive $50 off one month of training fees.<br>
        If you have any questions or need further information, please feel free to contact us at 
        <a href="mailto:admin@juniorathletic.ca">admin@juniorathletic.ca</a> or 647-260-9736.</p>
      <p style="color: #000000;">We look forward to seeing your child on ${child1Start} ${childDayOfClassTime}!</p>
      <p style="color: #000000;">Best regards,<br>
        Coaching Staff<br>
        Junior Athletics</p>
    `;
    await sendMail(email, emailSubject, emailHTML);

    res.status(200).json({ success: true, message: 'Registration updated successfully', updatedRegistration });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

const deleteRegistration = async (req, res) => {
  try {
    const programID = req.params.id
    const deleteRegistration = await registrationModel.findByIdAndDelete(programID)
    if (!deleteRegistration) {
      return res.status(404).json({ success: false, message: 'Registration Not found' });
    }
    res.status(200).json({ success: true, message: 'Registration Deleted successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}

export { createRegistration, getRegistration, updateRegistration, deleteRegistration }



