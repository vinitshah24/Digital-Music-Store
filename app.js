const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const errorPageController = require('./controllers/error');
const aboutRoutes = require('./routes/about');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

// Using EJS library
app.set('view engine', 'ejs');
app.set('views', 'views');

// For parsing bodies of incoming requests
app.use(bodyParser.urlencoded({ extended: false }));
// Directory for all the publicly available files
app.use(express.static(path.join(__dirname, 'public')));

//From routes/ dir
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(aboutRoutes);

// Default page
app.use(errorPageController.error404);

/*
app.use((req, res, next) => {
    res.status(404).sendFile(
        path.join(__dirname, 'views', '404.html')
    );
});
*/

app.listen(3000);