const express = require('express');
const mongoose = require('mongoose');
const config = require('../config');
const {pantry} = require ('../models/pantryModel');
const router = express.Router();
const pantryController = require('../controllers/pantryController');

//post new pantry item
router.post('/newPantryItem', pantryController.newPantryItem);

router.get('/allPantryItems', pantryController.allPantryItems);

router.delete('/deletePantryItem/:id', pantryController.deletePantryItem);

module.exports = router;