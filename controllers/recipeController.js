const config = require('../config');
const {recipe, ingredientItem} = require('../models/recipeModel');

exports.middlewareOne = (req, res, next) => {
  console.log('middlewareOne')
  next()
}

exports.middlewareTwo = (req, res, next) => {
  console.log('middlewareTwo')
  next()
}


//Post new recipe
exports.createRecipe = (req, res) => {
  let ingredientItems = [];
  for(let i = 0; i < req.body.recipeIngredients.length; i++){
    let newIngredientItemSchema = new ingredientItem();
    newIngredientItemSchema.name = req.body.recipeIngredients[i].name;
    newIngredientItemSchema.quantity = req.body.recipeIngredients[i].quantity;
    ingredientItems.push(newIngredientItemSchema)
  }
  let newRecipeSchema = new recipe();
  newRecipeSchema.recipeTitle = req.body.recipeTitle;
  newRecipeSchema.recipeIngredients = ingredientItems;
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
}

//Get one recipe
exports.getOneRecipe = (req, res) => {
  recipe.findOne({recipeSlug: req.params.recipeSlug})
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
}

//Get all recipes
exports.getAllRecipes = (req, res) => {
  recipe.find({})
  .then((recipes) => {
    res.status(200).json({
      message: 'Here are all of your recipes',
      data: recipes
    })
  console.log(recipes)
  })
  .catch((err) => {
    res.status(500).json({
      message: 'Unable to retrieve recipes'
    })
    console.log(err)
  });
}

//Delte one recipe
exports.deleteOneRecipe = (req, res) => {
  recipe.deleteOne({recipeSlug: req.params.recipeSlug})
  .then((recipe) => {
    res.status(200).json({
      message: `${req.params.recipeSlug} has been deleted`
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Unable to delte recipe'
      });
    });
  });
}
