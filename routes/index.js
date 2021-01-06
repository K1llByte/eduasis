const express = require('express');
const User = require('../controllers/user')

const router = express.Router();

function verify_authorization(req, res, next)
{
    if(req.user.lvl == 1)
    {
        next();
    }
    else
    {
        req.status(403).jsonp({error:"Forbidden"});
    }

}


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


// POST login authentication 
router.post('/protected', verify_authorization ,function(req, res, next) {
    res.status(200).jsonp({data: "Lista d ecoisas"});
});

module.exports = router;
