const userSchema = require('../models/authModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');

exports.login = (req, res) => {
  userSchema.findOne({userName: req.body.userName})
  .then((user) => {
    if(!req.body.userName || !req.body.password){
      res.status(500).send('username and password required');
      return
    }
    if(!user){
      res.status(500).send('user does not exist');
      return
    }
    if(!bcrypt.compareSync(req.body.password, user.password)){
      res.status(500).send('wrong password');
    }
    let userToken = {
      userName: userSchema.userName,
      firstName: userSchema.firstName,
      lastName: userSchema.lastName
    }
    token = jwt.sign(userToken, config.JWT_SECRET);
    console.log(`token: ${token}`);
    res.status(200).json({
      message: `${user.userName} successfully logged in`,
      userId: user._id,
      token: token
    });
  }).catch((err) => {
    console.log(err);
    res.status(500).send('Something bad happened');
  });
}

exports.register = (req, res) => {
  userSchema.findOne({userName: req.body.userName})
  .then((user) => {
    console.log(user)
    if(user){
      console.log('catch')
      res.status(401).json({
        message: 'An account already exists with this username'
      });
      return
    }
    if(!req.body.userName){
      console.log(req.body)
      res.status(401).json({
        message:'username required'
      });
      return
    }
    if(!req.body.password){
      res.status(401).json({
        message:'password required'
      });
      return
    }
    if(!req.body.firstName || !req.body.lastName){
      res.status(401).json({
        message:'first and last name required'
      });
      return
    }
    const newUser = new userSchema();
    newUser.firstName = req.body.firstname;
    newUser.lastName = req.body.lastName;
    newUser.userName = req.body.userName;
    bcrypt.hash(req.body.password, 8, (err, hash) => {
      if(err){
        console.log(err)
      }else{
        console.log(hash)
      }
      newUser.password = hash;
      newUser.save((err, user) => {
        if(err){
          console.log(err)
          res.status(500).send('something bad happened');
        }
        res.status(200).send(newUser);
      });
    }).catch((err) => {
      res.status(500).error('something bad happened');
    });
  });
}