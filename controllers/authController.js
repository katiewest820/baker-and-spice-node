const userSchema = require('../models/authModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');

exports.login = (req, res) => {
  userSchema.findOne({userName: req.body.userName})
  .then((user) => {
    if(!req.body.userName || !req.body.password){
      res.status(401).json({
        message:'username and password required'
      });
      return;
    }
    if(!user){
      res.status(401).json({
        message:'The username you entered does not exist'
      });
      return;
    }
    if(!bcrypt.compareSync(req.body.password, user.password)){
      res.status(401).json({
        message:'Wrong password'
      });
    }
    let userToken = {
      userName: userSchema.userName,
      firstName: userSchema.firstName,
      lastName: userSchema.lastName
    }
    token = jwt.sign(userToken, config.JWT_SECRET);
    res.status(200).json({
      message: `${user.userName} successfully logged in`,
      userId: user._id,
      token: token
    });
  })
  .catch((err) => {
    res.status(500).send('Something bad happened');
  });
}

exports.register = (req, res) => {
  userSchema.findOne({userName: req.body.userName})
  .then((user) => {
    if(user){
      res.status(401).json({
        message: 'This username is taken. Please try again'
      });
      return;
    }
    if(!req.body.userName){
      res.status(401).json({
        message:'username required'
      });
      return;
    }
    if(!req.body.password){
      res.status(401).json({
        message:'password required'
      });
      return;
    }
    if(!req.body.firstName || !req.body.lastName){
      res.status(401).json({
        message:'first and last name required'
      });
      return;
    }
    const newUser = new userSchema();
    newUser.firstName = req.body.firstname;
    newUser.lastName = req.body.lastName;
    newUser.userName = req.body.userName;
    bcrypt.hash(req.body.password, 8, (err, hash) => {
      newUser.password = hash;
      newUser.save((err, user) => {
        if(err){
          res.status(500).json({
            message:'something bad happened'
          });
        }
        res.status(200).send(newUser);
      });
    })
    .catch((err) => {
      res.status(500).json({
        message:'something bad happened'
      });
    });
  });
}