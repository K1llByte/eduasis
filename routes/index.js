const express = require('express');
const User = require('../controllers/user')

const router = express.Router();


// GET home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/students', function(req, res) {
  // Data retrieve
  User.list()
    .then(data => {console.log("ok1"); res.render('index', { title: 'Ola mundo cruel' }); console.log("ok2");})
    .catch(err => {console.log("ok3"); res.render('error', { error: err }); console.log("ok4"); });

});

module.exports = router;
