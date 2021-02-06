const express = require('express');
const axios = require('axios');
const router = express.Router();
const passport = require('passport');
const { post } = require('../app');
const jwt = require('jsonwebtoken');
const FormData = require('form-data');
const multer = require('multer');

API_URL = 'http://localhost:7700/api'

function check_auth(req, res, next)
{
    if(req.isAuthenticated())
    {
        // req.isAuthenticated() will return true if user is logged in
        const decoded = jwt.decode(req.user.token);
        //console.log(decoded);
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

// ========= TEMPORARY STORAGE ========= //

const storage = multer.diskStorage({
    destination : (req, file, next) => {
        console.log("PASSOU POR AQUI");
        next(null,'tmp');
    },
    filename : (req, file, next) => {
        console.log("PASSOU POR ACULA");
        req.file = file;
        next(null,`file.zip`);
    }
});

const upload = multer({ 
    "storage": storage
});

// ===================================== //

// ---------------------------------------------------------------
//----------- ROTAS NAO NECESSITAM AUTENTICAÇAO ------------------
// ---------------------------------------------------------------

// GET home page
router.get('/', (req, res, next) => {
  // res.render('index', { title: 'Express' });
  res.redirect('login');
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
    console.log(req.body);
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
// ------------- PAGINAS QUE NECESSITAM AUTENTICAÇAO -------------
// ---------------------------------------------------------------

router.get('/eduasis', check_auth, async (req,res) => {

    let resources_p = await axios.get(`${API_URL}/resources`,auth_header(req.user.token));
    let posts_p = await axios.get(`${API_URL}/posts`,auth_header(req.user.token));

    let resources = resources_p.data;
    let posts = posts_p.data;
    
    res.render('home_page',{
        'posts': posts,
        'resources': resources,
    });
});


router.get('/users/:username/edit', check_auth, async (req, res) => {
    if(req.params.username === req.user.username)
    {
        // The _p at the end indicates that 
        // this variable is a promise 
        let user_p = axios.get(
            `${API_URL}/users/${req.user.username}`,
            auth_header(req.user.token));

        let user = (await user_p).data;
        res.render('profile_edit',{
            'user': user,
            'active': 'profile'
        });
    }
    else
    {
        res.status(401).render('error', {err:{"status":401 , "message":"Forbidden"}} );
    }
});


router.post('/users/:username/edit', check_auth, async (req, res) => {
    if(req.params.username === req.user.username)
    {
        console.log("req.body",req.body);
        // let header_body = {
        //     headers: { 'Authorization': 'Bearer ' + token },
        //     body: {

        //     }
        // } ;
        // // The _p at the end indicates that 
        // // this variable is a promise 
        // let user_p = axios.put(
        //     `${API_URL}/users/${req.user.username}`,
        //     auth_header(req.user.token));

        // let user = (await user_p).data;
        res.redirect(`/users/${req.user.username}`);
    }
    else
    {
        res.status(401).render('error',{err:{"status":401 , "message":"Forbidden"}});
    }
});


router.get('/users/@me', check_auth, async (req, res) => {
    res.redirect(`/users/${req.user.username}`);
});


router.get('/users/:username', check_auth, async (req, res) => {
    
    let username = req.params.username;
    let view_type = 'other';
    if(username ===  req.user.username)
    {
        view_type = 'me';
    }
    

    // The _p at the end indicates that 
    // this variable is a promise 
    let user_p = axios.get(
        `${API_URL}/users/${username}`,
        auth_header(req.user.token));

    let resources_p = axios.get(
        `${API_URL}/resources?author=${username}`,
        auth_header(req.user.token));

    let posts_p = axios.get(
        `${API_URL}/posts/?author=${username}`,
        auth_header(req.user.token));

    try {
        let user = (await user_p).data;
        let resources = (await resources_p).data;
        let posts = (await posts_p).data;

        res.render('profile',{
            "user": user,
            'resources': resources,
            'posts': posts,
            'view_type': view_type,
            'active': 'profile'
        });
    }
    catch(error) {
        res.render('error',{err: error});
    }
});


//router.get('/profile/:username', check_auth, (req, res) => {
//  // Data retrieve
//  // utilizador, posts_do_utilizador, recursos_do_utilizador
//  axios.get(`${API_URL}/users/`+req.params.username,{
//    headers: { 'Authorization': 'Bearer ' + req.user.token }
//  })
//    .then(user=>{
//      axios.get(`${API_URL}/posts/`,{
//        headers: { 'Authorization': 'Bearer ' + req.user.token }
//      })
//        .then(posts=>{
//          axios.get(`${API_URL}/resources/`,{
//            headers: { 'Authorization': 'Bearer ' + req.user.token }
//          })
//            .then(resources=>{
//              res.render('profile_user',{"active": "profile", 'user':user.data, 'posts':posts.data, 'resources':resources.data})
//            })
//            .catch(erro => {
//              res.render('error',{err: erro})
//            })
//        })
//        .catch(erro => {
//          res.render('error',{err: erro})
//        })
//    })
//    .catch(erro => {
//      res.render('error',{err: erro})
//    })
//});





// router.get('/profile_edit/:username', check_auth, (req, res) => {
//   // Data retrieve
//   axios.get(`${API_URL}/users/`+req.params.username,{
//     headers: { 'Authorization': 'Bearer ' + req.user.token }
//   })
//     .then(user=>
//               res.render('profile_edit',{"active": "profile", 'user':user.data}))
//     .catch(erro => {
//       res.render('error',{err: erro})
//     })
// });

// //POST edit avatar
// router.post('/profile_edit/:username', check_auth, (req, res) => {
//   // Data retrieve
//   axios.put(`${API_URL}/users/`+req.params.username, JSON.stringify(req.body))
//     .then(res.redirect('/profile_edit/'+req.params.username))
//     .catch(err => res.render('error', {err:err}));
// });


//----------- ROTAS NEW RESOURCE/POST --------------------
router.get('/new_resource', check_auth, (req, res) => {
    // Data retrieve
    console.log(req.body)
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
router.post('/new_resource', check_auth, upload.single('arquive'), (req, res) => { //
    // Data retrieve
    console.log("req.file",req.file);
    console.log("req.arquive",req.arquive);

    res.redirect('/eduasis');
    //axios.post(`${API_URL}/resources`, JSON.stringify(req.body))
    //  .then(res.redirect('/eduasis'))
    //  .catch(err => res.render('error', {err:err}));
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
    
    if(req.query.type_id === '0')
    {
          delete req.query.type_id;
    }

    axios.get(`${API_URL}/resource_types/`,{
        headers: { 'Authorization': 'Bearer ' + req.user.token }
    })
    .then(resource_types => {
        axios.get(`${API_URL}/resources/`,{
            headers: { 'Authorization': 'Bearer ' + req.user.token },
            params: req.query
        })
        .then(resources=>{
            res.render('resources',{"active": "resources", "types":resource_types.data, "resources":resources.data});
        })
        .catch(err => res.render('error', {err: err}))
    })
    .catch(error => {
        res.render("error",{"err":error});
    });
});


router.get('/posts', check_auth, (req, res) => {
  // Data retrieve
  //post_id
  res.render('posts');
});

// router.get('/resource/:id', check_auth, (req, res) => {
//   // Data retrieve
//   //resource_id
//   res.render('resource');
// });

router.get('/resources/:resource_id', check_auth, (req, res) => {
    // Data retrieve
    axios.get(`${API_URL}/resources/${req.params.resource_id}`,{
        headers: { 'Authorization': 'Bearer ' + req.user.token }
    })
    .then(resource => {
        res.render('resource',{"resource":resource.data});
    })
    .catch(err => {
        res.render('error', {err: err})
    });
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