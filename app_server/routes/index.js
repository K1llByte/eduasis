const express = require('express');
const axios = require('axios');
const router = express.Router();
const passport = require('passport');
const { post } = require('../app');
const jwt = require('jsonwebtoken');

API_URL = 'http://localhost:7700/api'

function check_auth(req, res, next)
{
    if(req.isAuthenticated())
    {
        //req.isAuthenticated() will return true if user is logged in
        const decoded = jwt.decode(req.user.token);
        console.log(decoded);
        req.user.username = decoded.username;
        req.user.perms = decoded.perms;
        next();
    } 
    else
    {
        res.redirect("/login");
    }
}

// GET home page
router.get('/', (req, res, next) => {
  // res.render('index', { title: 'Express' });
  res.render('login');
});

router.get('/login', (req, res, next) => {
  res.render('login');
});


router.post('/login', passport.authenticate('local'), (req, res) => {
    // Data retrieve
    res.redirect('/eduasis')
    //console.log("user",req.user);
    //console.log("passport",req.passport);
});


router.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy((err) => {
    if (!err) {
        res.redirect('/');
    } else {
        console.log('Destroy session error: ', err)
    }
  });
});

router.get('/register', (req, res) => {
  // Data retrieve
  res.render('register');

});

router.post('/register', (req, res) => {
    // Data retrieve
    // console.log(JSON.stringify(req.body))
    axios.post(`${API_URL}/register`, {
        username: req.body.username,
        nickname: req.body.nickname,
        email: req.body.email,
        password: req.body.password
    })
    .then(dados => {
        console.log('status message:' + dados.status + 'message?' + dados.message);
        if(dados.status == "200")
            res.redirect('/login');
        else
        {
            console.log(dados.status);
            res.redirect('/register');
        }
    })
    .catch(err => res.render('error', {error:err}));
});


router.get('/eduasis', check_auth, (req,res) => {
  // Data retrieve
  // utilizador, recursos_recentes, posts_recentes
  res.render('home_page');

});

router.get('/profile', check_auth, (req, res) => {
  // Data retrieve
  // utilizador, posts_do_utilizador, recursos_do_utilizador
  res.render('profile',{'user':{
    "username": "killbyte",
    "nickname": "Jojo",
    "email": "somethingsomething@blabla.com",    
  }, "active": "profile"
});
});

router.get('/profile/:username', check_auth, (req, res) => {
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

router.get('/profile_edit', check_auth, (req, res) => {
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


router.get('/new_resource', check_auth, (req, res) => {
    // Data retrieve
    //types id
    axios.get(`${API_URL}/resource_types/`,{
        headers: { 'Authorization': 'Bearer ' + req.user.token }
    })
    .then(resources_types=>{
        res.render('new_resource');
    })
    .catch(err => res.render('error', {err: err}))
});

//POST new resource
router.post('/new_resource', check_auth, (req, res) => {
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


router.get('/new_post', check_auth, (req, res) => {
  // Data retrieve
  //resource_id
  res.render('new_post',{"active": "new_post"});
});

//POST new post


router.get('/resource', check_auth, (req, res) => {
  // Data retrieve
  //resource_id
  res.render('resource');
});

router.get('/post', check_auth, (req, res) => {
  // Data retrieve
  //post_id
  res.render('post');
});



module.exports = router;