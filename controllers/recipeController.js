const jwt = require('jsonwebtoken');
const config = require('../config').JWT_SECRET;
const {recipe, ingredientItem} = require('../models/recipeModel');
const jimp = require('jimp');
const multer = require('multer');
const uuid = require('uuid');

const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter: (req, file, next) => {
    const isImage = file.mimetype.startsWith('image/')
    if(isImage){
      next(null, true)
    }else{
      next({message: 'File type not allowed'}, false)
    }
  }
};

exports.uploadImages = multer(multerOptions).single('photo')

exports.checkForToken = (req, res, next) => {
  const token = req.headers.authorization || req.body.token;
  console.log(req.body)
  if (!token) {
    res.status(401).json({
      message: "unauthorized"
    });
    return;
  }
  jwt.verify(token, config, (error, decode) => {
    if (error) {
      res.status(500).json({
        message: "Token is not valid",
        error: error
      });
      return;
    }
    req.user = decode;
    next();
  });
}

exports.resizeImages = (req, res, next) => {
  if(!req.file){
    next()
    return
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.recipeImages = `${uuid.v4()}.${extension}`;
  jimp.read(req.file.buffer)
  .then((result) => {
    result.resize(800, jimp.AUTO)
    result.write(`public/uploads/${req.body.recipeImages}`)
    //TODO serve static files in server.js
    next()
  })
}

//Post new recipe
exports.createRecipe = (req, res) => {
  let ingredientItems = [];
  for(let i = 0; i < req.body.recipeIngredients.length; i++){
    let newIngredientItemSchema = new ingredientItem();
    newIngredientItemSchema.name = req.body.recipeIngredients[i].name.trim();
    newIngredientItemSchema.quantity = req.body.recipeIngredients[i].quantity.trim();
    ingredientItems.push(newIngredientItemSchema);
  }
  let newRecipeSchema = new recipe();
  newRecipeSchema.recipeTitle = req.body.recipeTitle;
  newRecipeSchema.recipeIngredients = ingredientItems;
  newRecipeSchema.recipeInstructions = req.body.recipeInstructions;
  //newRecipeSchema.recipeImages = req.body.recipeImages;
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
        message: 'No recipe by that name found',
        data: null
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

