const pantry = require ('../models/pantryModel');
//const jwt = require('jsonwebtoken');
//const config = require('../config').JWT_SECRET;

//post new pantry item
exports.newPantryItem = (req, res) => {
console.log(req.body)
  let newPantryItem = new pantry();
  newPantryItem.userId = req.body.userId;
  newPantryItem.item = req.body.item;
  newPantryItem.inStock = req.body.inStock;
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

//get all pantry items
exports.allPantryItems = (req, res) => {
  console.log(req.params)
  pantry.find({userId: req.params.userId})
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

//delete one pantry item
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

//edit one pantry item
exports.editPantryItem = (req, res) => {
  pantry.findById(req.params.id)
  .then((pantryItem) => {
    let editFields = ['item', 'inStock'];
      editFields.forEach((field) => {
        if(field in req.body){
          pantryItem[field] = req.body[field]
        }
      })  
    pantryItem.save(); 
    res.status(200).json({
      message: 'Your pantry item has been updated',
      data: pantryItem
    });
    console.log(pantryItem)
  })
  .catch((err) => {
    res.status(500).json({
      message: 'Unable to update your pantry item'
    });
  });
}