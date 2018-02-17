const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const {app, runServer, closeServer} = require('../server');
const {Pantry} = require('../models/pantryModel');
const mongoose = require('mongoose');
const { DATABASE_URL } = require('../config');
mongoose.Promise = global.Promise;

chai.use(chaiHttp);

let userId = '5a7b3efba168c182bc8c15ba';
let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE1MTg4MjM4MzR9.JlI1doGPq-56I25BloS9V4-7RkeQNJqjQOkpJZvzOBQ';

  
describe('Trip test API resources', function() {
  before(function() {
    return runServer(DATABASE_URL)
    //return Promise.resolve(runServer(DATABASE_URL)).then(() => {
      //done()
    });
 // });
   

  describe('GET all pantryItems', function(){
    it('should get all pantry items for one user', function(){
       this.timeout(5000)
      return chai.request(app)

        .get(`/pantry/allPantryItems/${userId}`)
        .set('authorization', token)
        .then((res) => {

          res.should.have.status(200);
          console.log('got here')
        })
         // .catch((err) => {
         //   console.log(err)
         // });

    })
    
  });

   after(function(done) {

        closeServer().then(() => {
          console.log('in after')
          //done()
          //process.exit(0)

          done()
        })
    })
});