const mongoose = require('mongoose');

var pantrySchema = new mongoose.Schema({
  item: String,
  inStock: Boolean
});

module.exports = mongoose.model('pantry', pantrySchema);