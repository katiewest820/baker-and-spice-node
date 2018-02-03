const express = require('express');
const mongoose = require('mongoose');
const config = require('../config');
const {recipe, ingredientItem} = require('../models/recipeModel');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

//Get one recipe
//TODO make search more flexible 
//TODO make each slug individual
router.get('/getRecipe/:recipeSlug', recipeController.getOneRecipe);

//Post new recipe
router.post('/newRecipe', recipeController.middlewareOne, recipeController.middlewareTwo, recipeController.createRecipe);

//Get all recipes
router.get('/getAllRecipes', recipeController.getAllRecipes);

//Delete one recipe
router.delete('/deleteOne/:recipeSlug', recipeController.deleteOneRecipe);

module.exports = router;