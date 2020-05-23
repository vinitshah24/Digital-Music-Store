const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

require('dotenv').config();

const errorPageController = require('./controllers/error');
const User = require('./models/user');

const aboutRoutes = require('./routes/about');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

// Express
const app = express();

// Session Store
const store = new MongoDBStore({
    uri: process.env.MONGO_DB_URL,
    collection: 'sessions'
});

// CSURF
const csrfProtection = csrf();

// Using EJS library
app.set('view engine', 'ejs');
app.set('views', 'views');

// For parsing bodies of incoming requests
app.use(bodyParser.urlencoded({ extended: false }));
// Directory for all the publicly available files
app.use(express.static(path.join(__dirname, 'public')));
//Setup the Session Store
app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store
    })
);
// Setup CSRF Protection
app.use(csrfProtection);
//Setup Flash messages
app.use(flash());

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

// This will set local variables in all the rendered views (requests)
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

//From routes/ dir
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(aboutRoutes);
app.use(authRoutes);
// Default page
app.use(errorPageController.error404);

const URI = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONDO_DB_PASSWORD}@cluster0-sitmo.mongodb.net/${process.env.MONGO_DB_DATABASE}`;

mongoose
    .connect(URI,
        { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => { app.listen(3000); })
    .catch(err => { console.log(err); });