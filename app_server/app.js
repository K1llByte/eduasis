const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const jwt = require('jsonwebtoken');
//const methodOverride = require('method-override');

var { v4: uuidv4 } = require('uuid');
var session = require('express-session');
const FileStore = require('session-file-store')(session);

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var axios = require('axios')



// Configuração da estratégia local
passport.use(new LocalStrategy(
    { usernameField: 'username' }, (user, pass, done) => {
        axios.post('http://localhost:7700/api/login/',{username: user, password: pass})
        .then(dados => {
            const decoded = jwt.decode(dados.data.TOKEN);
            //console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
            
            const user_data = {
                "token" : dados.data.TOKEN,
                "username" : decoded.username,
                "perms" : decoded.perms
            }
            done(null, user_data);
        })
        .catch(err => {
            done(err);
        });
    })
)

// Indica-se ao passport como serializar o utilizador
passport.serializeUser((user,done) => {
    //console.log('Serielização, id: ' + user.username)
    done(null, user)
})
  
// Desserialização: a partir do id obtem-se a informação do utilizador
passport.deserializeUser((user, done) => {
  // console.log('Desserielização, id: ' + uid)
    //axios.get('http://localhost:7700/api/users/' + user.username,{
    //    headers: { 'Authorization': 'Bearer ' +  }
    // })
    //.then(dados => done(null, dados))
    //.catch(erro => done(erro, false));
    done(null, user);
})


var index_router = require('./routes/index');
var app = express();

app.use(session({
  genid: (req) => {
    return uuidv4()
  },
  store: new FileStore({logFn: function(){}}),
  secret: 'O meu segredo',
  resave: false,
  saveUninitialized: false,
  retries: 0
}))


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//app.use(methodOverride('_method'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('O meu segredo'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
  // console.log('Signed Cookies: ', JSON.stringify(req.signedCookies))
  // console.log('Session: ', JSON.stringify(req.session))
  next()
})

// Routes
app.use('/', index_router);
app.use('/static',express.static(path.join(__dirname, 'static')));


// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// app.set('etag', false)

// app.use((req, res, next) => {
//   res.set('Cache-Control', 'no-store')
//   next()
// })

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    console.log(err);
    res.render('error',{ "err" : err });
});

module.exports = app;
