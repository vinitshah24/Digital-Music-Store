exports.getIndex = (req, res, next) => {
    // render about page in controllers
    res.render('about', {
        path: '/about',
        pageTitle: 'About'
    });
};