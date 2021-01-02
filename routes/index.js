const express = require('express');
const User = require('../controllers/user')

const router = express.Router();


// GET home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home Page', data : [] });
});

router.get('/users', function(req, res) {
  // Data retrieve
  User.get("user1")
    .then(data => { console.log(data); res.render('index', { title:"Users Page", data: data }); })
    .catch(err => { res.render('error', { error: err }); });
});

module.exports = router;
