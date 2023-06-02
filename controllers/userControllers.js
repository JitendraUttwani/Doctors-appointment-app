// const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const appointmentModel = require('../models/appointmentModel');
const { findByIdAndUpdate } = require('../models/doctorModel');
const doctorModel = require('../models/doctorModel')
const userModel = require('../models/userModel');
const moment = require('moment')

const registerController = async (req,res) => {
  try{
    const currentUser = await userModel.findOne({email: req.body.email});
    if(currentUser){
      return res.status(200).send({message: "User already exist",success: false});
    }else{
      const password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const newPassword = await bcrypt.hash(password,salt);
      req.body.password = newPassword;
      const newUser = new userModel(req.body);
      await newUser.save();
      res.status(201).send({success: true,message: `Successfully registered user`});
    }
  }catch(err){
    console.log(err);
    res.status(500).send({success: false,message:`Register Controller err ${err.message}`});
  }
};
const loginController = async (req,res) => {
  try{
    const user = await userModel.findOne({email: req.body.email});
    if(!user){
      return res.status(200).send({message: "User not found",success : false});
    }
    const isCorrectUser = await bcrypt.compare(req.body.password,user.password);
    if(!isCorrectUser){
      return res
				.status(200)
				.send({ message: `Wrong email id or password`, success: false });
    }
    const token = jwt.sign({id:user._id},process.env.JSON_SECRET,{expiresIn: '1d'});
    res
			.status(200)
			.send({message: "Successfully logged in", success: true ,token});

  }catch(err){
    console.log(err);
    res.status(500).send({message:`Login Controller issue ${err}`,success: false});
  }
};
 
const authController = async (req,res) => {
  try{
    const user = await userModel.findOne({_id:req.body.userId});
    user.password = undefined;
    if(!user){
      return res.status(200).send({message:`User not found`,success: false});
    }
    return res.status(200).send({
      message: "User Authorized",
      data : user,
      success: true
    })

  }catch(err){
    console.log(err);
    return res.status(500).send({message:`Authcontroller issue ${err}`,success: false,err});
  }
}

const applyDoctorController = async (req,res) => {
  try{
    const newDoctor = await doctorModel({...req.body,status:'pending'});
    await newDoctor.save();
    const adminUser = await userModel.findOne({isAdmin: true});
    const notifications = adminUser.notifications;
    notifications.push({
      type: 'apply-doctor-request',
      message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
      data: {
        doctorId: newDoctor._id,
        name : newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: '/admin/doctors'
      }
    });
    const updated = await userModel.findByIdAndUpdate(adminUser._id,{notifications})
    res.status(201).send({
      success: true,
      message: 'Doctor applied successfully'
    });

  }catch(err){
    console.log(err);
    res.status(500).send({
      success: false,
      err,
      message: 'Apply Doctor controller is bad'
    });
  }
}

const getAllNotificationsController = async (req,res) => {
  try {
    const user = await userModel.findOne({_id:req.body.userId});
    const seennotifications = user.seennotifications;
    const notifications = user.notifications;
    seennotifications.push(...notifications);
    user.notifications = [];
    user.seennotifications = notifications;
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: 'Successfully got all notifications',
      data: updatedUser
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Notification controller not working"
    })
  }
}
const deleteAllNotificationsController = async (req,res) => {
  try {
    const user = await userModel.findOne({_id:req.body.userId});
    user.notifications = [];
    user.seennotifications = [];
    const updateUser = await user.save();
    res.status(200).send({
      success: true,
      message: 'Successfully deleted notifications',
      data: updateUser,
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Delete Notification controller is bad',
      error
    })
    
  }
}

const getAllDoctorsController = async (req,res) => {
  try {
    const doctors = await doctorModel.find({status:'approved'});
    res.status(200).send({
      success: true,
      message: 'Get all doctors controller works fine',
      data: doctors
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: 'Get all doctors controller is bad'
    })
  }
}

const bookAppointmentController = async (req, res) => {
	try {
		req.body.status = 'pending';
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();
    const user = await userModel.findOne({_id:req.body.doctorInfo.userId});
    user.notifications.push({
      type: 'book-appointment-request',
      message: 'Someone just booked an appointment',
      onClickPath: '/user/appointments'
    })
		await user.save();
		res.status(201).send({
			success: true,
			message: "Booked appointment successfully",
		});
	} catch (err) {
		console.log(err);
		res.status(500).send({
			success: false,
			err,
			message: "Book appointment controller is bad",
		});
	}
};

const bookingAvailabilityController = async (req, res) => {
	try {
		const date = moment(req.body.date,"DD-MM-YYYY").toISOString();
    const fromTime = moment(req.body.time,"HH:mm").subtract(1,"hours").toISOString();
    const toTime = moment(req.body.time,"HH:mm").add(1,"hours").toISOString();
    const doctorId = req.body.doctorId;
    const appointments = await appointmentModel.find({
      doctorId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime,
      }
    });
    if(appointments.length > 0){
      return res.status(201).send({
        success: false,
        message: 'Not Available'
      })
    }

		return res.status(201).send({
			success: true,
			message: "Appointment is available",
		});
	} catch (err) {
		console.log(err);
		res.status(500).send({
			success: false,
			err,
			message: "Booking availability controller is bad",
		});
	}
};

const userAppointmentsController = async (req, res) => {
	try {
    const appointments = await appointmentModel.find({
      userId: req.body.userId
    });
		res.status(201).send({
			success: true,
			message: "showing all appointments you made",
      data: appointments
		});
	} catch (err) {
		console.log(err);
		res.status(500).send({
			success: false,
			err,
			message: "user appointments controller is bad",
		});
	}
};



module.exports = {loginController,registerController,authController,applyDoctorController,getAllNotificationsController,deleteAllNotificationsController,getAllDoctorsController,bookAppointmentController,bookingAvailabilityController,userAppointmentsController};