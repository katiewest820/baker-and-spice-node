const mocha = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const {app, runServer, closeServer} = require('../server');
const pantry = require('../models/pantryModel');
const {recipe, ingredientItem} = require('../models/recipeModel');
const mongoose = require('mongoose');
const { TESTING_DATABASE_URL } = require('../config');
const faker = require('faker');
mongoose.Promise = global.Promise;

chai.use(chaiHttp);

let token;
let userId;
let pantryItemId;
let thisRecipeSlug;
let thisRecipeId;

function createTestUser(){
  let newTestUser = {
    firstName: 'Izzy',
    lastName: 'West',
    userName: 'izzy.west123',
    password: 'password123'
  }
  return chai.request(app)
  .post('/auth/register')
  .send(newTestUser)
  .then((res) => {
      console.log('inside of create test user')
    })
  .catch((err) => {
    console.log('error happened in create user')
  });
};

function loginTestUser(){
  let loginTestUser = {
    userName: 'izzy.west123',
    password: 'password123'
  }
  return chai.request(app)
  .post('/auth/login')
  .set("content-type", "application/json")
  .send(loginTestUser)
  .then((res) => {
    token = res.body.token;
    userId = res.body.userId;
  })
  .catch((err) => {
    console.log('error happened in login user')
  });
}

function generateIngredientData(){
  return {
    name: faker.lorem.word(),
    quantity: faker.random.number()
  }
}

function seedIngredientData(){
  let testIngredients = [];
  for(let i = 0; i < 3; i++){
    testIngredients.push(generateIngredientData())
  }
  return testIngredients;
}

function generateRecipeData(){
  let recipeTitle = faker.lorem.words();
  let recipeSlug = recipeTitle.split(' ').join('-');
  return {
    userId: userId,
    recipeTitle: recipeTitle,
    recipeSlug: recipeSlug,
    recipeIngredients: seedIngredientData(),
    recipeInstructions: faker.lorem.sentence()
  }
}

function seedRecipeData(){
  testRecipes = [];
  for(let i = 0; i < 3; i++){
    testRecipes.push(generateRecipeData());
  }
  return recipe.insertMany(testRecipes);
}

function generatePantryData(){
  return {
    userId: userId,
    item: faker.lorem.word(),
    inStock: true
  }
}

function seedPantryData(){
  let testPantry = [];
  for(let i = 0; i < 5; i++){
    testPantry.push(generatePantryData());
  }
  return pantry.insertMany(testPantry);
}

function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}


describe('Trip test API resources', function() {
  before(function(done) {
    this.timeout(100000)
    runServer(TESTING_DATABASE_URL).then(() => {
      Promise.resolve(createTestUser()).then(() => {
        Promise.resolve(loginTestUser()).then(() => {
          seedRecipeData();
          seedPantryData();
          done();
        });
      });      
    });
  });

  after(function(){
    tearDownDb();
    closeServer();
    return;
  }); 
  
  describe('GET all pantryItems', function(){
    it('should get all pantry items for one user', function(){
      this.timeout(5000)
      return chai.request(app)
      .get(`/pantry/allPantryItems/${userId}`)
      .set('authorization', token)
      .then((res) => {
        res.should.have.status(200);
        res.body.data.length.should.equal(5);
      })
      .catch((err)=> {
        console.log('an error happened in get pantry items')
      });
    });
  });

  describe('POST of pantry item', function(){
    it('should post pantry item to db', function(){
      this.timeout(10000)
      let newPantryItem = {
        userId: userId,
        item: faker.lorem.word(),
        inStock: true
      }
      return chai.request(app)
      .post('/pantry/newPantryItem')
      .set('authorization', token)
      .set('content-type', 'application/json')
      .send(JSON.stringify(newPantryItem))
      .then((res) => {
        res.should.have.status(200);
        pantryItemId = res.body.data._id;
        res.body.data.item.should.equal(newPantryItem.item);
        res.body.data.inStock.should.equal(newPantryItem.inStock);
        res.body.data.userId.should.equal(userId);
      })
      .catch((err) => {
        console.log('an error happened in post pantry item')
      });
    });
  });

  describe('Edit of pantry item', function(){
    it('should edit pantry item in db', function(){
      let editedPantryItem = {
        item: 'new awesome item',
        inStock: false
      }
      return chai.request(app)
      .put(`/pantry/editOnePantryItem/${pantryItemId}`)
      .set('authorization', token)
      .send(editedPantryItem)
      .then((res) => {
        res.should.have.status(200);
        res.body.data.item.should.equal(editedPantryItem.item);
        res.body.data.inStock.should.equal(editedPantryItem.inStock);
        res.body.data._id.should.equal(pantryItemId);
      })
      .catch((err) => {
        console.log('an error happened in put pantry item')
      });
    });
  });

  describe('Delete of pantry item', function(){
    it('should delete pantry item from db', function(){
      return chai.request(app)
      .delete(`/pantry/deletePantryItem/${pantryItemId}`)
      .set('authorization', token)
      .then((res) => {
        res.should.have.status(200);
        res.body.data._id.should.equal(pantryItemId);
      })
      .catch((err) => {
        console.log('an error happened in delete pantry item')
      });
    });
  });

  describe('Get of all recipes', function(){
    it('should return all recipes from db', function(){
      return chai.request(app)
      .get(`/recipe/getAllRecipes/${userId}`)
      .set('authorization', token)
      .then((res) => {
        thisRecipeSlug = res.body.data[0].recipeSlug;
        res.should.have.status(200);
        res.body.data.length.should.equal(3);
      })
      .catch((err) => {
        console.log('an error happened in get all of recipes')
      });
    });
  });

  describe('Get one recipe', function(){
    it('should return one recipe from db', function(){
      return chai.request(app)
      .get(`/recipe/getRecipe/${userId}/${thisRecipeSlug}`)
      .set('authorization', token)
      .then((res) => {
        res.should.have.status(200);
        res.body.data.recipeSlug.should.equal(thisRecipeSlug);
      })
      .catch((err) => {
        console.log('an error happened in get one recipe')
      });
    });
  });

  describe('Post new recipe', function(){
    it('should post new recipe to db', function(){
      let newRecipeIngredients = 
        [{
          name: 'ice cream', 
          quantity: '100 cups'
        }, 
        {
          name: 'apples',   
          quantity:'10'
        }];
      let newRecipe = {
        recipeTitle: 'new awesome title',
        recipeInstructions: 'This is the best ever. you are awesome.',
        userId: userId,
        recipeIngredients: JSON.stringify(newRecipeIngredients)
      }
      return chai.request(app)
      .post('/recipe/newRecipe')
      .set('authorization', token)
      .send(newRecipe)
      .then((res) => {
        thisRecipeId = res.body.data._id;
        res.should.have.status(200);
        res.body.data.recipeTitle.should.equal(newRecipe.recipeTitle);
        res.body.data.recipeInstructions.should.equal(newRecipe.recipeInstructions);
      })
      .catch((err) => {
        console.log('an error happened in post recipe')
      });
    });
  });

  describe('Edit recipe', function(){
    it('should edit one pantry item in db', function(){
      let editsToRecipeIngredients = 
        [{
          name: 'new ice cream', 
          quantity: '100 gallons'
        }, 
        {
          name: 'new apples',   
          quantity:'100'
        }];
      let editThisRecipe = {
        recipeTitle: 'even newer and awesomer recipe title',
        recipeInstructions: 'this is even better and more awesome. yea yea yea',
        recipeIngredients: JSON.stringify(editsToRecipeIngredients) 
      }
      return chai.request(app)
      .put(`/recipe/editRecipe/${thisRecipeId}`)
      .set('authorization', token)
      .send(editThisRecipe)
      .then((res) => {
        res.should.have.status(200);
        res.body.data.recipeTitle.should.equal(editThisRecipe.recipeTitle);
        res.body.data.recipeInstructions.should.equal(editThisRecipe.recipeInstructions);
      })
      .catch((err) => {
        console.log('an error happened in edit recipe')
      });
    });
  });

  describe('Delete recipe', function(){
    it('should delete one recipe from db', function(){
      return chai.request(app)
      .delete(`/recipe/deleteOne/${thisRecipeSlug}`)
      .set('authorization', token)
      .then((res) => {
        res.should.have.status(200);
        res.body.message.should.equal(`${thisRecipeSlug} has been deleted`);
      })
      .catch((err) => {
        console.log('an error happened in delete recipe')
      });
    });
  });

});