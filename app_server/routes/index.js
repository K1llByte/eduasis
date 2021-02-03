const express = require('express');
const axios = require('axios');
const router = express.Router();
const passport = require('passport');
const { post } = require('../app');

API_TOKEN = ''
API_URL = 'http://localhost:7700/api'

// GET home page
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.render('login');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});


router.post('/login', passport.authenticate('local'), function(req, res) {
  // Data retrieve
  res.redirect('/eduasis')
});


router.get('/logout', function(req, res){
  req.logout();
  req.session.destroy(function (err) {
    if (!err) {
        res.redirect('/');
    } else {
        console.log('Destroy session error: ', err)
    }
  });
});

router.get('/register', function(req, res) {
  // Data retrieve
  res.render('register');

});

router.post('/register', function(req, res) {
  // Data retrieve
  // console.log(JSON.stringify(req.body))
  axios.post(`${API_URL}/register`, {
    username: req.body.username,
    nickname: req.body.nickname,
    email: req.body.email,
    password: req.body.password
  })
  .then( dados => {
    console.log('status message:' + dados.status + 'message?' + dados.message)
    if(dados.status == "200")
      res.redirect('/login')
    else{
      console.log(dados.status)
      res.redirect('/register')
    }
  })
  .catch(err => res.render('error', {error:err}));
});


router.get('/eduasis', verificaAutenticacao, function (req,res) {
  // Data retrieve
  // utilizador, recursos_recentes, posts_recentes
  res.render('home_page');

});

router.get('/profile', verificaAutenticacao, function(req, res) {
  // Data retrieve
  // utilizador, posts_do_utilizador, recursos_do_utilizador
  res.render('profile',{'user':{
    "username": "killbyte",
    "nickname": "Jojo",
    "email": "somethingsomething@blabla.com",    
  }, "active": "profile"
});
});

router.get('/profile/:username', verificaAutenticacao, function(req, res) {
  // Data retrieve
  // utilizador, posts_do_utilizador, recursos_do_utilizador
  axios.get(`${API_URL}/users/`+req.params.username)
    .then(user=>{
      axios.get(`${API_URL}/posts/`)
        .then(posts=>{
          axios.get(`${API_URL}/resources/`)
            .then(resources=>{
              res.render('profile',{'user':user, 'posts':posts, 'resources':resources})
            })
            .catch(erro => {
              res.render('error',{err: erro})
            })
        })
        .catch(erro => {
          res.render('error',{err: erro})
        })
    })
    .catch(erro => {
      res.render('error',{err: erro})
    })
});

router.get('/profile_edit', verificaAutenticacao, function(req, res) {
  // Data retrieve
  //user
  res.render('profile_edit',{'user':{
    "username": "killbyte",
    "nickname": "Jojo",
    "email": "somethingsomething@blabla.com",   
  },"active": "profile"
});
});

//POST edit avatar


router.get('/new_resource', verificaAutenticacao, function(req, res) {
  // Data retrieve
  //types id
  axios.get(`${API_URL}/resource_types/`)
  .then(resources_types=>{
      res.render('new_resource');
    })
    .catch(err => res.render('error', {err: err}))
});

//POST new resource
router.post('/new_resource', verificaAutenticacao, function(req, res) {
  // Data retrieve
  //types id
  axios.post(`${API_URL}/resources`,{

  })
    .then(res.redirect('/eduasis'))
    .catch(err => res.render('error', {err:err}));
});

// router.post('/register', function(req, res) {
//   // Data retrieve
//   // console.log(JSON.stringify(req.body))
//   axios.post(`${API_URL}/register`, {
//     username: req.body.username,
//     nickname: req.body.nickname,
//     email: req.body.email,
//     password: req.body.password
//   })
//   .then( dados => {
//     console.log('status message:' + dados.status + 'message?' + dados.message)
//     if(dados.status == "200")
//       res.redirect('/login')
//     else{
//       console.log(dados.status)
//       res.redirect('/register')
//     }
//   })
//   .catch(err => res.render('error', {error:err}));
// });


router.get('/new_post', verificaAutenticacao, function(req, res) {
  // Data retrieve
  //resource_id
  res.render('new_post',{"active": "new_post"});
});

//POST new post


router.get('/resource', verificaAutenticacao, function(req, res) {
  // Data retrieve
  //resource_id
  res.render('resource');
});

router.get('/post', verificaAutenticacao, function(req, res) {
  // Data retrieve
  //post_id
  res.render('post');
});


//ADMINS

function verificaAutenticacao(req, res, next){
  if(req.isAuthenticated()){
  //req.isAuthenticated() will return true if user is logged in
    next();
  } else{
  res.redirect("/login");}
}

module.exports = router;
