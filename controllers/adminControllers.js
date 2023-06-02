const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModel");

const getAllUsersController = async (req,res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send({
      success: true,
      message: "Successfully fetched all users",
      data: users
    })
    
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Problem fetching Users',
      error
    })
  }

}

const getAllDoctorsController = async (req,res) => {
  try {
		const doctors = await doctorModel.find({});
		res.status(200).send({
			success: true,
			message: "Successfully fetched all doctors",
			data: doctors,
		});
	} catch (error) {
		console.log(error);
		res.status(500).send({
			success: false,
			message: "Problem fetching Doctors",
			error,
		});
	}

}

const changeAccountStatusController = async (req,res) => {
  try {
    const {doctorId , status} = req.body;
    const doctor = await doctorModel.findByIdAndUpdate(doctorId,{status});
    const user = await userModel.findOne({_id: doctor.userId});
    const notifications = user.notifications;
    notifications.push({
			type: "doctor-account-status-updated",
			message: `Updated doctor status is ${status}`,
      onClickPath: '/notifications'
		});
    user.isDoctor = status === 'approved' ? true : false;
    await user.save();
    res.status(201).send({
      success: true,
      message: 'Account status successfully updated',
      data: doctor
    })

    
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Cant change account status',
      error
    })
  }
}

module.exports = {getAllDoctorsController,getAllUsersController,changeAccountStatusController};