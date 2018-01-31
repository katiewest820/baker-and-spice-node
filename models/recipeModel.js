const mongoose = require('mongoose');
const slugs = require('slugs');

var recipeSchema = new mongoose.Schema({
  recipeTitle: {type: String, default: ''},
  recipeSlug: String,
  recipeIngredient: [],
  recipeQuantity: [],
  recipeImages: [String],
  recipeInstructions: String
}); 
recipeSchema.pre('save', function(next){
  console.log('pre-save is happening')
  console.log(next)
  this.recipeSlug = slugs(this.recipeTitle)
  next()
});

module.exports = mongoose.model('recipe', recipeSchema);