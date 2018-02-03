const pantry = require ('../models/pantryModel');
const config = require('../config');

//post new pantry item
exports.newPantryItem = (req, res) => {
  let newPantryItem = new pantry();
  newPantryItem.item = req.body.item;
  newPantryItem.inStock = true;
  newPantryItem.save()
  .then((newItem) => {
    res.status(200).json({
      message: 'Pantry Item saved',
      data: newItem
    });
  })
  .catch((err) => {
    res.status(500).json({
      message: 'Pantry Item not saved'
    });
    console.log(err)
  });
}

exports.allPantryItems = (req, res) => {
  pantry.find({})
  .then((items) => {
    res.status(200).json({
      message: 'Here are all of your pantry items',
      data: items
    });
  })
  .catch((err) => {
    res.status(500).json({
      message: 'Unable to retrieve pantry items'
    });
  });
}

exports.deletePantryItem = (req, res) => {
  pantry.findByIdAndRemove(req.params.id)
  .then((item) => {
    res.status(200).json({
      message: 'Pantry item deleted',
      data: item
    });
  })
  .catch((err) => {
    res.status(500).json({
      message: 'Unable to delete pantry item'
    });
  });
}