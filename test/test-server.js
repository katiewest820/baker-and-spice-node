const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const {app} = require('../server');
const {Pantry} = require('../models/pantryModel');
const mongoose = require('mongoose');

chai.use(chaiHttp);

let userId = '5a7b3efba168c182bc8c15ba';
let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MTg4MjM4MzR9.JlI1doGPq-56I25BloS9V4-7RkeQNJqjQOkpJZvzOBQ';

describe('GET all pantryItems', function(){
  it('should get all pantry items for one user', function(){
    return chai.request(app)
      .get(`/pantry/allPantryItems/${userId}`)
      .set('authorization', token)
      .then((res) => {
        res.should.have.status(200);
      })
      .catch((err) => {
        console.log(err)
      });
  });
});