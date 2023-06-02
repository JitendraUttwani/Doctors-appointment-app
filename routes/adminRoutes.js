const {getAllDoctorsController,getAllUsersController, changeAccountStatusController} = require('../controllers/adminControllers');
const authMiddleware = require('../middlewares/authMiddleware');

const express = require('express');

const router = express.Router();

router.get('/getAllUsers',authMiddleware,getAllUsersController);

router.get('/getAllDoctors',authMiddleware,getAllDoctorsController);

router.post('/changeAccountStatus',authMiddleware,changeAccountStatusController);


module.exports = router;