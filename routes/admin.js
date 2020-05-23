const path = require('path');
const express = require('express');

const adminController = require('../controllers/admin');

//Add Middleware to ensure that unauthorized user is not able to visit protected sites 
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/add', isAuth, adminController.getAddProduct); // /admin/add => GET
router.get('/products', isAuth, adminController.getProducts); // /admin/products => GET
router.get('/edit/:productId', isAuth, adminController.getEditProduct);

router.post('/add', isAuth, adminController.postAddProduct); // /admin/add => POST
router.post('/edit', isAuth, adminController.postEditProduct);
router.post('/delete', isAuth, adminController.postDeleteProduct);

module.exports = router;
