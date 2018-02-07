const mongoose = require('mongoose');
const slugs = require('slugs');

var ingredientItemSchema = new mongoose.Schema({
  name: String,
  quantity: String
});

var recipeSchema = new mongoose.Schema({
  recipeTitle: {type: String, default: ''},
  recipeSlug: String,
  recipeIngredients: [ingredientItemSchema],
  recipeImages: String,
  recipeInstructions: String
}); 

recipeSchema.pre('save', function(next){
  //TODO check for same slugs in database
  console.log('pre-save is happening')
  this.recipeSlug = slugs(this.recipeTitle)
  next()
});

let ingredientItem = mongoose.model('ingredientItem', ingredientItemSchema);
let recipe = mongoose.model('recipe', recipeSchema);


module.exports = {
  recipe: recipe,
  ingredientItem: ingredientItem
}