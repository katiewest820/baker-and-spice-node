const express = require('express');
const mongoose = require('mongoose');
const config = require('../config');
const {recipe, ingredientItem} = require('../models/recipeModel');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const sharedController = require('../controllers/sharedController');

router.use(sharedController.checkForToken);
//Get one recipe
//TODO make search more flexible 
//TODO make each slug individual
router.get('/getRecipe/:userId/:recipeSlug', recipeController.getOneRecipe);

//Post new recipe
router.post('/newRecipe', recipeController.uploadImages, recipeController.resizeImages, recipeController.createRecipe);

//Get all recipes
router.get('/getAllRecipes/:userId', recipeController.getAllRecipes);

//Get recipes by search term
router.get('/getRecipesBySearchTerm/:userId/:searchTerm', recipeController.getRecipesBySearchTerm);

//Delete one recipe
router.delete('/deleteOne/:recipeSlug', recipeController.deleteOneRecipe);

//Edit recipe
router.put('/editRecipe/:Id', recipeController.uploadImages, recipeController.resizeImages, recipeController.editRecipe);

module.exports = router;