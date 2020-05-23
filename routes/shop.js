const path = require('path');
const express = require('express');

const shopController = require('../controllers/shop');

// Disallow unauthorized users from accessing the protected pages
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/', shopController.getIndex);
router.get('/products', shopController.getProducts);
router.get('/product/:productId', shopController.getProduct);
router.get('/cart', isAuth, shopController.getCart);
router.get('/orders', isAuth, shopController.getOrders);
router.get('/checkout', isAuth, shopController.getCheckout);

router.post('/cart', isAuth, shopController.postCart);
router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);
router.post('/create-order', isAuth, shopController.postOrder);

module.exports = router;
