const path = require('path');
const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/add', adminController.getAddProduct); // /admin/add => GET
router.get('/products', adminController.getProducts); // /admin/products => GET
router.get('/edit/:productId', adminController.getEditProduct);

router.post('/add', adminController.postAddProduct); // /admin/add => POST
router.post('/edit', adminController.postEditProduct);
router.post('/delete', adminController.postDeleteProduct);

module.exports = router;
