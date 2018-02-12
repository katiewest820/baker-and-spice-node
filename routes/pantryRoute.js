const express = require('express');
const mongoose = require('mongoose');
const config = require('../config');
const {pantry} = require ('../models/pantryModel');
const router = express.Router();
const pantryController = require('../controllers/pantryController');
const sharedController = require('../controllers/sharedController');

router.use(sharedController.checkForToken);

//post new pantry item
router.post('/newPantryItem', pantryController.newPantryItem);

//get all pantry items
router.get('/allPantryItems/:userId', pantryController.allPantryItems);

//delete one pantry item
router.delete('/deletePantryItem/:id', pantryController.deletePantryItem);

//edit one pantry item
router.put('/editOnePantryItem/:id', pantryController.editPantryItem);

module.exports = router;