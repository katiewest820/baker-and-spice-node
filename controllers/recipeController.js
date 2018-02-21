const {recipe, ingredientItem} = require('../models/recipeModel');
const jimp = require('jimp');
const multer = require('multer');
const uuid = require('uuid');
const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');

//uploading image files
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

exports.uploadImages = multer(multerOptions).single('recipeImages');

//saving image to cloudinary
cloudinary.config({ 
  cloud_name: 'doezp37xg', 
  api_key: '964288955197663', 
  api_secret: 'GshQJPyZDCkUvptoJzSBZXeWK5s' 
});

exports.uploadToCloudinary = (req, res, next) => {
  if(!req.file){
    next();
    return;
  }
  let baseData = new Buffer(req.file.buffer).toString('base64');
  cloudinary.v2.uploader.upload('data:image/png;base64,' + baseData, function (error, result){ 
    req.body.recipeImages = result.secure_url;
    next() 
  });
}

//Post new recipe
exports.createRecipe = (req, res) => {
  let ingredientItems = [];
  let recipeIngredients = JSON.parse(req.body.recipeIngredients);
  for(let i = 0; i < recipeIngredients.length; i++){
    let newIngredientItemSchema = new ingredientItem();
    newIngredientItemSchema.name = recipeIngredients[i].name.trim().toLowerCase();
    newIngredientItemSchema.quantity = recipeIngredients[i].quantity.trim().toLowerCase();
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
    res.status(500).json({
      message: 'Recipe not saved'
    });
  });
}

//Edit recipe
exports.editRecipe = (req, res) => {
  recipe.findOne({_id: req.params.Id})
  .then((recipe) => {
    let recipeIngredients = JSON.parse(req.body.recipeIngredients);
    let fieldsToEdit = ['recipeTitle', 'recipeSlug', 'recipeIngredients', 'recipeInstructions', 'recipeImages'];
    fieldsToEdit.forEach((field) => {
      if(field in req.body){
        if(field == 'recipeIngredients'){
          for(let i = 0; i < recipeIngredients.length; i++){
            recipeIngredients[i].name = recipeIngredients[i].name.trim().toLowerCase();
            recipeIngredients[i].quantity = recipeIngredients[i].quantity.trim().toLowerCase();
          }
          recipe[field] = recipeIngredients;
        }else{
          recipe[field] = req.body[field].trim().toLowerCase();
        }
      }
    });
    recipe.save().then((doc) => {
      res.status(200).json({
        message: 'Edits to recipe saved',
        data: recipe
      });
    });
  })
  .catch((err) => {
    res.status(500).json({
      message: 'Edits not saved'
    });
  });
}

//Get one recipe
exports.getOneRecipe = (req, res) => {
  recipe.findOne({userId: req.params.userId, recipeSlug: req.params.recipeSlug})
  .then((recipe) => {
    if(!recipe){
       res.status(500).json({
        message: 'Oops! Unable to find that recipe',
        data: null
      });
      return;
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
    });
  })
  .catch((err) => {
    res.status(500).json({
      message: 'Oops! Unable to retrieve your recipes at this time'
    });
  });
}

exports.getRecipesBySearchTerm = (req, res) => {
  recipe.find({userId: req.params.userId, recipeTitle: { $regex: [req.params.searchTerm] }})
  .then((recipes) => {
    res.status(200).json({
      message: 'Here are all of your recipes',
      data: recipes
    });
  })
  .catch((err) => {
    res.status(500).json({
      message: 'No recipe by that name found'
    });
  });
}

//Delte one recipe
exports.deleteOneRecipe = (req, res) => {
  recipe.deleteOne({recipeSlug: req.params.recipeSlug})
  .then((recipe) => {
    res.status(200).json({
      message: `${req.params.recipeSlug} has been deleted`
    });
  })
  .catch((err) => {
    res.status(500).json({
      message: 'Oops! Unable to delte this recipe'
    });
  });
}

