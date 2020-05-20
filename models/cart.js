const fs = require('fs');
const path = require('path');

const appPath = require('../utils/path');
const cartFile = path.join(appPath, 'data', 'cart.json')

class Cart {
    static addProduct(id, productPrice) {
        // Fetch the previous cart
        fs.readFile(cartFile, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 };
            if (!err) {
                cart = JSON.parse(fileContent);
            }
            // Find existing product in the cart
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            // Increase quantity if prodct exists
            if (existingProduct) {
                updatedProduct = { ...existingProduct };
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
                //Add new product if doesn't exist
            } else {
                updatedProduct = { id: id, qty: 1 };
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice += productPrice;
            fs.writeFile(cartFile, JSON.stringify(cart), err => { console.log(err); });
        });
    }

    static deleteProduct(id, productPrice) {
        fs.readFile(cartFile, (err, fileContent) => {
            if (err) {
                return;
            }
            const updatedCart = { ...JSON.parse(fileContent) };
            const product = updatedCart.products.find(prod => prod.id === id);
            if (!product) {
                return;
            }
            const productQty = product.qty;
            updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
            updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;

            fs.writeFile(cartFile, JSON.stringify(updatedCart), err => { console.log(err); });
        });
    }

    static getCart(callBackFunction) {
        fs.readFile(cartFile, (err, fileContent) => {
            const cart = JSON.parse(fileContent);
            if (err) callBackFunction(null);
            else callBackFunction(cart);
        });
    }
};

module.exports = Cart;