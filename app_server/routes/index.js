const express = require('express');

const router = express.Router();
//const path = require('path');


// GET home page
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.render('login');
});

router.get('/login', function(req, res) {
  // Data retrieve
  res.render('login');
});

router.get('/register', function(req, res) {
  // Data retrieve
  res.render('register');

});

router.get('/eduasis', function(req, res) {
  // Data retrieve
  res.render('home_page', {"data": {
    "resource":{
        "id": 1,
        "owner": "Kirubaito",
        "title": "Resource title",
        "description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae similique inventore, at ipsa blanditiis, commodi modi obcaecati dolores sint nostrum autem accusamus! Voluptatibus pariatur, rerum placeat nam commodi necessitatibus inventore!",
        "files":[{"nome": "xixi.json"}, {"nome": "coco.json"}]
    },
    "post":{
        "owner": "Jojo",
        "resource_id": 1,
        "description": "DESCRIÇAO DO POST: Something somthing blablabla",
        "comments": [{"user": "jose1", "comment": "comentario numero 2 - bbbbbbbbbbbbbbbb bbbbbbbbbb"},{"user": "maria2", "comment":"comentario numero 1 - bbbb aaaaaaaaaaaaaaa aaaaaaaaaaaaaa aaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaa bbbbbbbbbbbb bbbbbb rrrrrrrrrrrrrrrrrr rrrrrrrrrrrrrrrr rrrrrrrrrrrrr ffffffffffffffffffffffff fffffffffffffffff fffffffffffffffffff fbbbbbb hhhhhhhh ccccccccccc ddddddddddddddd"}]
    }
}});

});

router.get('/profile', function(req, res) {
  // Data retrieve
  res.render('profile',{'user':{
    "username": "killbyte",
    "nickname": "Jojo",
    "email": "somethingsomething@blabla.com",
    
}});

});

module.exports = router;
