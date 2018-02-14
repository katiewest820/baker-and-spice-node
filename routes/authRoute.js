const express = require('express');
const mongoose = require('mongoose');
const userSchema = require('../models/authModel');
const router = express.Router();
let token;

const authController = require ('../controllers/authController');

//login route
router.post('/login', authController.login);

//register route
router.post('/register', authController.register); 

module.exports = router;