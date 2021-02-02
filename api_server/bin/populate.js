const mongoose = require('mongoose');
// Import Models
const User = require('../controllers/user');
const Resource = require('../controllers/resource');
const ResourceType = require('../controllers/resource_type');
const Post = require('../controllers/post');

const MONGODB_URL = 'mongodb://127.0.0.1/eduasis';
mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

const AFFILIATIONS =[ 
    "Universidade do Minho", 
    "Universidade do Porto", 
    "Universidade de Coimbra",
    "Universidade de Aveiro",
    "Politécnico de Leiria",
    "Universidade de Lisboa",
    "Universidade do Algarve",
    "Instituto Superior de Economia e Gestão",

];
// ================ //

rand_choice = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}

sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// ================ //

let users_success = 0;
let users_error = 0;
console.log("Preparing database populating ...");

let users_to_insert = [
    {
        "username":"trina",
        "password":"a_password",
        "email":"trina@mail.com",
        "affiliation": "Universidade do Minho",//rand_choice(AFFILIATIONS),
        "permissions":128
    },
    {
        "username":"jojo",
        "password":"a_password",
        "email":"jojo@mail.com",
        "affiliation": "Universidade do Minho",//rand_choice(AFFILIATIONS),
        "permissions":128
    }
]

async function add_user(userdata)
{
    User.get(userdata.username)
    .then(data => {
        if(data != null) 
        {
            ++users_error;
            return;
        } 
        User.gen_password_hash(userdata.password)
            .then(passwd_hash => {

                const date_now = Date.now();
                User.insert({
                    "username" : userdata.username,
                    "nickname" : "",
                    "password_hash" : passwd_hash,
                    "email" : userdata.email,
                    "affiliation" : userdata.affiliation,
                    "permissions" : userdata.permissions,
                    "registration_date" : date_now,
                    "last_login_date" : date_now,
                    "avatar_url" : ""
                })
                .then(data => {
                    ++users_success;
                })
                .catch(err => {
                    ++users_error;
                })
                
        });
    });
}

function populate_users(users_array)
{
    users_array.forEach(u => {
        add_user(u);
    });
}

async function print_values()
{
    await sleep(2000);
    console.log("Users: ",users_success,"Created",users_error,"Not created");
}


populate_users(users_to_insert);
print_values();