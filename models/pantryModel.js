const mongoose = require('mongoose');

var pantrySchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  item: String,
  inStock: Boolean
});

module.exports = mongoose.model('pantry', pantrySchema);