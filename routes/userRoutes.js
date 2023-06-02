const express = require("express");
const {
	loginController,
	registerController,
	authController,
	applyDoctorController,
	getAllNotificationsController,
	deleteAllNotificationsController,
	getAllDoctorsController,
	bookAppointmentController,
	bookingAvailabilityController,
	userAppointmentsController,
} = require("../controllers/userControllers");
const authMiddleware = require("../middlewares/authMiddleware");

//router onject
const router = express.Router();

//routes
//LOGIN || POST
router.post("/login", loginController);

//REGISTER || POST
router.post("/register", registerController);

//Auth || POST
router.post("/getUserData", authMiddleware, authController);

//APply Doctor || POST
router.post("/apply-doctor", authMiddleware, applyDoctorController);

//Notifiaction  Doctor || POST
router.post(
	"/get-all-notifications",
	authMiddleware,
	getAllNotificationsController
);
//Notifiaction  Doctor || POST
router.post(
	"/delete-all-notifications",
	authMiddleware,
	deleteAllNotificationsController
);

//GET ALL DOC
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);

//BOOK APPOINTMENT
router.post("/book-appointment", authMiddleware, bookAppointmentController);

//Booking Avliability
router.post(
	"/booking-availbility",
	authMiddleware,
	bookingAvailabilityController
);

//Appointments List
router.get("/user-appointments", authMiddleware, userAppointmentsController);

module.exports = router;
