const express = require('express');
const axios = require('axios');
const router = express.Router();
const passport = require('passport');
const { post } = require('../app');
const jwt = require('jsonwebtoken');
const FormData = require('form-data');
const multer = require('multer');

var bodyParser = require('body-parser')
var jsonfile = require('jsonfile')
var fs = require('fs')

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
        'user':req.user
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
        axios.put(
            `${API_URL}/users/${req.user.username}`,
            {
                nickname: (req.body.nickname == '') ? undefined :req.body.nickname,
                affiliation: (req.body.affiliation == '') ? undefined :req.body.affiliation,
                email: (req.body.email == '') ? undefined :req.body.email
            },
            auth_header(req.user.token))
        .then(res.redirect(`/users/${req.user.username}`))
        .catch(err => res.render('error', {err:err}))
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


//----------- ROTAS NEW RESOURCE/POST --------------------
router.get('/new_resource', check_auth, (req, res) => {
    // Data retrieve
    console.log(req.body)
    axios.get(`${API_URL}/resource_types/`,{
        headers: { 'Authorization': 'Bearer ' + req.user.token }
    })
    .then(resource_types=>{
        // console.log(resources_types.data)
        res.render('new_resource',{
            "active": "new_resource", 
            'user':req.user,
            "types":resource_types.data
        });
    })
    .catch(err => res.render('error', {err: err}))
});


//POST new resource
router.post('/new_resource', upload.single('arquive'), (req, res) => { //
    // Data retrieve
    console.log("req.file",req.files);
    console.log("req.arquive",req.arquive);

    // var fstream;
    // req.pipe(req.busboy);
    // console.log("req.busboy",req.busboy);
    console.log("OVER");
    res.redirect('/new_resource');
    
    // req.busboy.on('file', function (fieldname, file, filename) {
    //     console.log("Uploading: " + filename); 
    //     fstream = fs.createWriteStream(__dirname + '/files/' + filename);
    //     file.pipe(fstream);
    //     fstream.on('close', function () {
    //         res.redirect('/eduasis');
    //     });
    // });

    // res.redirect('/new_resource');
    //axios.post(`${API_URL}/resources`, JSON.stringify(req.body))
    //  .then(res.redirect('/eduasis'))
    //  .catch(err => res.render('error', {err:err}));
});

router.get('/new_post', check_auth, (req, res) => {
  // Data retrieve
    res.render('new_post',{"active": "new_post", 'user':req.user});
});

router.get('/new_post/:id', check_auth, (req, res) => {
  // Data retrieve
    res.render('new_post',{
        "active": "new_post", 
        'user':req.user, 
        "resource_id": req.params.id
    });
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
            res.render('resources',{
                "active": "resources", 
                'user':req.user,
                "types":resource_types.data,
                "resources":resources.data});
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
        res.render('resource',{"resource":resource.data, 'user':req.user});
    })
    .catch(err => {
        res.render('error', {err: err})
    });
});


router.get('/post/:id', check_auth, (req, res) => {
  // Data retrieve
  //post_id
  res.render('post', {'user':req.user});
});

//----------- ROTAS MANAGER --------------------

router.get('/managment', check_auth, (req, res) => {
  // Data retrieve
  //post_id
  res.render('managment', {'user':req.user});
});

router.post('/managment', check_auth, (req, res) => {
  // Data retrieve
  //post_id
  res.render('managment', {'user':req.user});
});

module.exports = router;