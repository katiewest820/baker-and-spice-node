const express = require('express');
const mongoose = require('mongoose');
const config = require('../config');
const recipeSchema = require('../models/recipeModel');

const router = express.Router();

router.post('/newRecipe', (req, res) => {
  let newRecipeSchema = new recipeSchema();
  newRecipeSchema.recipeTitle = req.body.recipeTitle;
  newRecipeSchema.recipeIngredient = req.body.recipeIngredient;
  newRecipeSchema.recipeQuantity = req.body.recipeQuantity;
  newRecipeSchema.recipeInstructions = req.body.recipeInstructions;
  newRecipeSchema.save()
  .then((newRecipe) => {
    res.status(200).json({
      message: 'Here is your new recipe',
      data: newRecipe
    });
  })
  .catch((err) => {
    console.log(err)
    res.status(500).json({
      message: 'Recipe not saved'
    });
  });
});

router.get('/getRecipe/:recipeSlug', (req, res) => {
  recipeSchema.findOne({recipeSlug: req.params.recipeSlug})
  .then((recipe) => {
    console.log(recipe)
    if(!recipe){
       res.status(500).json({
        message: 'No recipe by that name found'
      });
      return
    }
    res.status(200).json({
      message: 'Here is your recipe',
      data: recipe
    });
  })
  .catch((err) => {
    res.status(500).json({
      message: 'Error happened when requesting recipe'
    });
  });
});

module.exports = router;