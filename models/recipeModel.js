const mongoose = require('mongoose');
const slugs = require('slugs');

var ingredientItemSchema = new mongoose.Schema({
  name: String,
  quantity: String
});

var recipeSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  recipeTitle: {type: String, default: ''},
  recipeSlug: String,
  recipeIngredients: [ingredientItemSchema],
  recipeImages: String,
  recipeInstructions: String
}); 

recipeSchema.pre('save', function(next){
  this.recipeSlug = slugs(this.recipeTitle);
  const slugRegEx = new RegExp(`^${this.recipeSlug}((-[0-9]*$)?)$`, 'i');
  this.constructor.find({recipeSlug: slugRegEx})
  .then((recipesSlug) => {
    if(recipesSlug.length){
      this.recipeSlug = `${this.recipeSlug}-${recipesSlug.length +1}`;
    }
    next();
  })
  .catch((err) => {
    console.log('error occured in recipeSlug creation')
  });
});

let ingredientItem = mongoose.model('ingredientItem', ingredientItemSchema);
let recipe = mongoose.model('recipe', recipeSchema);


module.exports = {
  recipe: recipe,
  ingredientItem: ingredientItem
}