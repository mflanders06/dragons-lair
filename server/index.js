require ('dotenv').config();
const express = require('express');
const massive = require('massive');
const session = require('express-session');
const authCtrl = require('./controllers/authController');
const treasureCtrl = require('./controllers/treasureController')

const app = express();

const { CONNECTION_STRING, SESSION_SECRET, SERVER_PORT} = process.env;

app.use(express.json());
app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

app.listen(SERVER_PORT, () => console.log(`Listening on Port ${SERVER_PORT}`));


massive({
    connectionString: CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false
    }
}).then((dbInstance) => {
    app.set('db', dbInstance);
    console.log('Server connection successful!');
});

app.post('/auth/register', authCtrl.register);
app.post('/auth/login', authCtrl.login);
app.get('/auth/logout', authCtrl.logout);