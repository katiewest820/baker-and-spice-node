//const jwt = require('jsonwebtoken');
//const config = require('../config').JWT_SECRET;
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

exports.uploadImages = multer(multerOptions).single('recipeImages')


exports.resizeImages = (req, res, next) => {
  console.log('resizeImages')
  if(!req.file){
    next()
    return
  }
  const extension = req.file.mimetype.split('/')[1];
  req.body.recipeImages = `${uuid.v4()}.${extension}`;
  jimp.read(req.file.buffer)
  .then((result) => {
    result.resize(800, jimp.AUTO)
    result.write(`public/${req.body.recipeImages}`)
    //TODO serve static files in server.js
    next()
  })
}

//Post new recipe
exports.createRecipe = (req, res) => {
  let ingredientItems = [];
  console.log(req.body)
  let recipeIngredients = JSON.parse(req.body.recipeIngredients)
  for(let i = 0; i < recipeIngredients.length; i++){
    let newIngredientItemSchema = new ingredientItem();
    newIngredientItemSchema.name = recipeIngredients[i].name.trim();
    newIngredientItemSchema.quantity = recipeIngredients[i].quantity.trim();
    ingredientItems.push(newIngredientItemSchema);
  }
  let newRecipeSchema = new recipe();
  newRecipeSchema.userId = req.body.userId;
  newRecipeSchema.recipeTitle = req.body.recipeTitle.trim().toLowerCase();
  newRecipeSchema.recipeIngredients = ingredientItems;
  newRecipeSchema.recipeInstructions = req.body.recipeInstructions;
  newRecipeSchema.recipeImages = req.body.recipeImages;
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

//Edit recipe
exports.editRecipe = (req, res) => {
  recipe.findOne({_id: req.params.Id})
  .then((recipe) => {
    console.log(recipe)
    
    console.log(req.body.recipeIngredients)
    let recipeIngredients = JSON.parse(req.body.recipeIngredients)
    console.log(recipeIngredients)
   
    let fieldsToEdit = ['recipeTitle', 'recipeSlug', 'recipeIngredients', 'recipeInstructions', 'recipeImages']
    fieldsToEdit.forEach((field) => {
      if(field in req.body){
        if(field == 'recipeIngredients'){
          recipe[field] = recipeIngredients
        }else{
          recipe[field] = req.body[field]
        }
      }
    })
    recipe.save().then((doc) => {
      console.log('starting doc')
      console.log(doc)
      console.log('ending doc')
      res.status(200).json({
        message: 'Edits to recipe saved',
        data: recipe
      });
    });
  })
  .catch((err) => {
    console.log(err)
    res.status(500).json({
      message: 'Edits not saved'
    });
  });
}

//Get one recipe
exports.getOneRecipe = (req, res) => {
  console.log(req.params.recipeSlug)
  console.log(req.params.userId)
  recipe.findOne({userId: req.params.userId, recipeSlug: req.params.recipeSlug})
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
  recipe.find({userId: req.params.userId})
  .then((recipes) => {
    res.status(200).json({
      message: 'Here are all of your recipes',
      data: recipes
    })
  })
  .catch((err) => {
    res.status(500).json({
      message: 'Unable to retrieve recipes'
    })
    console.log(err)
  });
}

exports.getRecipesBySearchTerm = (req, res) => {
  recipe.find({userId: req.params.userId, recipeTitle: { $regex: [req.params.searchTerm] }})
  .then((recipes) => {
    res.status(200).json({
      message: 'Here are all of your recipes',
      data: recipes
    })
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

