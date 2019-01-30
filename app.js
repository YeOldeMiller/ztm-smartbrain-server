require('dotenv').config();
const express = require('express'),
    app = express(),
    cors = require('cors'),
    bcrypt = require('bcrypt-nodejs'),
    knex = require('knex')({
        client: 'pg',
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: 'ztm'
        }
    });


const auth = require('./controllers/auth'),
    image = require('./controllers/image');

app.use(require('body-parser').json());
app.use(cors());

app.get('/', (req, res) => res.status(200));

app.post('/signin', (req, res) => auth.signinHandler(req, res, bcrypt, knex));
app.post('/register', (req, res) => auth.registerHandler(req, res, bcrypt, knex));
app.get('/profile/:id', (req, res) => auth.profileDetails(req, res, knex));
app.post('/imageurl', (req, res) => image.clarifaiHandler(req, res));
app.put('/image', (req, res) => image.imageHandler(req, res, knex));

app.listen(2999);