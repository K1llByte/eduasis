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
        // req.isAuthenticated() will return true if user is logged in
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

function auth_header(token)
{
    return {
        headers: { 'Authorization': 'Bearer ' + token }
    }
}

// ---------------------------------------------------------------
//----------- ROTAS NAO NECESSITAM AUTENTICAÇAO --------------------
// ---------------------------------------------------------------

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

// ---------------------------------------------------------------
//----------- ROTAS NECESSITAM AUTENTICAÇAO --------------------
// ---------------------------------------------------------------

router.get('/eduasis', check_auth, (req,res) => {
  // Data retrieve
  // utilizador, recursos_recentes, posts_recentes
  res.render('home_page');

});


router.get('/profile', check_auth, async (req, res) => {
    
    // The _p at the end indicates that 
    // this variable is a promise 
    let user_p = axios.get(
        `${API_URL}/users/@me`,
        auth_header(req.user.token));

    let resources_p = axios.get(
        `${API_URL}/resources?author=${req.user.username}`,
        auth_header(req.user.token));

    let posts_p = axios.get(
        `${API_URL}/posts/?author=${req.user.username}`,
        auth_header(req.user.token));

    try {
        let user = (await user_p).data;
        let resources = (await resources_p).data;
        let posts = (await posts_p).data;

        res.render('profile',{
            "user": user,
            'resources': await resources_p,
            'posts': await posts_p,
            active: 'profile'
        });
    }
    catch(error) {
        res.render('error',{err: error});
    }
});


router.get('/profile/:username', check_auth, (req, res) => {
  // Data retrieve
  // utilizador, posts_do_utilizador, recursos_do_utilizador
  axios.get(`${API_URL}/users/`+req.params.username,{
    headers: { 'Authorization': 'Bearer ' + req.user.token }
  })
    .then(user=>{
      axios.get(`${API_URL}/posts/`,{
        headers: { 'Authorization': 'Bearer ' + req.user.token }
      })
        .then(posts=>{
          axios.get(`${API_URL}/resources/`,{
            headers: { 'Authorization': 'Bearer ' + req.user.token }
          })
            .then(resources=>{
              res.render('profile_user',{"active": "profile", 'user':user.data, 'posts':posts.data, 'resources':resources.data})
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

router.get('/profile_edit/:username', check_auth, (req, res) => {
  // Data retrieve
  axios.get(`${API_URL}/users/`+req.params.username,{
    headers: { 'Authorization': 'Bearer ' + req.user.token }
  })
    .then(user=>
              res.render('profile_edit',{"active": "profile", 'user':user.data}))
    .catch(erro => {
      res.render('error',{err: erro})
    })
});

//POST edit avatar
router.post('/profile_edit/:username', check_auth, (req, res) => {
  // Data retrieve
  axios.put(`${API_URL}/users/`+req.params.username, JSON.stringify(req.body))
    .then(res.redirect('/profile_edit/'+req.params.username))
    .catch(err => res.render('error', {err:err}));
});


//----------- ROTAS NEW RESOURCE/POST --------------------
router.get('/new_resource', check_auth, (req, res) => {
    // Data retrieve
    axios.get(`${API_URL}/resource_types/`,{
        headers: { 'Authorization': 'Bearer ' + req.user.token }
    })
    .then(resource_types=>{
        // console.log(resources_types.data)
        res.render('new_resource',{"active": "new_resource", "types":resource_types.data});
    })
    .catch(err => res.render('error', {err: err}))
});

//POST new resource
router.post('/new_resource', check_auth, (req, res) => {
  // Data retrieve
  console.log(JSON.stringify(req.body))
  axios.post(`${API_URL}/resources`, JSON.stringify(req.body))
    .then(res.redirect('/eduasis'))
    .catch(err => res.render('error', {err:err}));
});

router.get('/new_post', check_auth, (req, res) => {
  // Data retrieve
  res.render('new_post',{"active": "new_post"});
});

router.get('/new_post/:id', check_auth, (req, res) => {
  // Data retrieve
  res.render('new_post',{"active": "new_post", "resource_id": req.params.id});
});

//POST new post
router.post('/new_post', check_auth, (req, res) => {
  // Data retrieve
  console.log(JSON.stringify(req.body))
  axios.post(`${API_URL}/posts`, JSON.stringify(req.body))
    .then(res.redirect('/eduasis'))
    .catch(err => res.render('error', {err:err}));
});



//----------- ROTAS RESORCES/POSTS --------------------

router.get('/resources', check_auth, (req, res) => {
  // Data retrieve
  axios.get(`${API_URL}/resource_types/`,{
      headers: { 'Authorization': 'Bearer ' + req.user.token }
  })
  .then(resource_types=>{
    axios.get(`${API_URL}/resources/`,{
      headers: { 'Authorization': 'Bearer ' + req.user.token }
    })
    .then(resources=>{
        res.render('resources',{"active": "resources", "types":resource_types.data, "resources":resources.data});
  })
  .catch(err => res.render('error', {err: err}))
  })
  .catch(err => res.render('error', {err: err}))
});


router.get('/posts', check_auth, (req, res) => {
  // Data retrieve
  //post_id
  res.render('posts');
});

router.get('/resource/:id', check_auth, (req, res) => {
  // Data retrieve
  //resource_id
  res.render('resource');
});

router.get('/resource/:id', check_auth, (req, res) => {
  // Data retrieve
  axios.get(`${API_URL}/resources/`+req.params.id,{
      headers: { 'Authorization': 'Bearer ' + req.user.token }
  })
  .then(resource=>{
      res.render('resource',{"resource":resource});
  })
  .catch(err => res.render('error', {err: err}))
});


router.get('/post/:id', check_auth, (req, res) => {
  // Data retrieve
  //post_id
  res.render('post');
});

//----------- ROTAS MANAGER --------------------

router.get('/managment', check_auth, (req, res) => {
  // Data retrieve
  //post_id
  res.render('managment');
});

router.post('/managment', check_auth, (req, res) => {
  // Data retrieve
  //post_id
  res.render('managment');
});

module.exports = router;