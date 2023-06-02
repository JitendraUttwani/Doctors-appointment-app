const appointmentModel = require("../models/appointmentModel");
const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModel");


const getDoctorInfoController = async (req,res) => {
  try {
    const userId = req.body.userId;
    const doctor = await doctorModel.findOne({userId: userId});
    res.status(200).send({
      success: true,
      message: 'Doc controller working',
      data: doctor,
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: 'Erorr with doc Controller'
    })
  }
}

const updateProfileController = async (req,res) => {
  try {
    const userId = req.body.userId;
    const doctor = await doctorModel.findOneAndUpdate({userId: userId},req.body);
    res.status(201).send({
      success: true,
      message: 'Update profile controller worked fine',
      data: doctor
    })
    
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: 'update profile controller error'
    })
  }
}

const getDoctorByIdController = async (req,res) => {
  try {
    const doctorId = req.body.doctorId;
    const doctor = await doctorModel.findOne({_id: doctorId});
    res.status(200).send({
      message: 'get doctor by id controller is working fine',
      success: true,
      data: doctor
    })
    
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: 'get doctor by id controller is not working',
      error,
      success: false,
    })
  }
}
const doctorAppointmentsController = async (req, res) => {
	try {
		const doctor = await doctorModel.findOne({
			userId: req.body.userId,
		});
		const appointments = await appointmentModel.find({
			doctorId: doctor._id,
		});
		res.status(201).send({
			success: true,
			message: "showing all appointments to doctor",
			data: appointments,
		});
	} catch (err) {
		console.log(err);
		res.status(500).send({
			success: false,
			err,
			message: "doctor appointments controller is bad",
		});
	}
};

const updateStatusController = async (req, res) => {
	try {
    const {appointmentId,status} = req.body;
    const appointment = await appointmentModel.findByIdAndUpdate(appointmentId,{status});
    const user = await userModel.findOne({
      _id: appointment?.userId,
    })
		const notifications = user?.notifications;
		notifications?.push({
			type: "update-status-request",
			message: "Updated status of your appointment",
			onClickPath: "/doctor-appointments",
		});
		await user?.save();
		res.status(201).send({
			success: true,
			message: "Updated status successfully",
		});
	} catch (err) {
		console.log(err);
		res.status(500).send({
			success: false,
			err,
			message: "Update status controller is bad",
		});
	}
};


module.exports = {getDoctorInfoController,updateProfileController,getDoctorByIdController,doctorAppointmentsController,updateStatusController};