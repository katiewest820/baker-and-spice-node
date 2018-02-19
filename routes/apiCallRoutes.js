const express = require('express');
const mongoose = require('mongoose');
const config = require('../config');
const router = express.Router();
const axios = require('axios');

router.get('/search/:searchTerm', (req, res) => {
  axios.get(`https://food2fork.com/api/search?key=198d93d3886d6987b95770e4e3682367&q=${req.params.searchTerm}`)
  .then((response)=> {
    res.status(200).send(response.data.recipes);
  })
  .catch((err) => {
    res.status(500).send(err);
  });
});

module.exports = router;