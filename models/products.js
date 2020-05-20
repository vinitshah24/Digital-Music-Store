const fs = require('fs');
const path = require('path');

const Cart = require('./cart');

const appPath = require('../utils/path');
const productsFile = path.join(appPath, 'data', 'products.json')

// Once the file is read, send the parsed result to the callback function
const getProductsFromFile = callBackFunction => {
    fs.readFile(productsFile, (err, fileContent) => {
        if (err) { callBackFunction([]); }
        else { callBackFunction(JSON.parse(fileContent)); }
    });
};

class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    static fetchAll(callBackFunction) {
        getProductsFromFile(callBackFunction);
    }

    static findByID(id, callBackFunction) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            callBackFunction(product);
        });
    }

    save() {
        getProductsFromFile(products => {
            // If the product ID exists, update it
            if (this.id) {
                const existingProductIndex = products.findIndex(
                    prod => prod.id === this.id
                );
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(productsFile, JSON.stringify(updatedProducts), err => {
                    console.log(err);
                });
                // If not, add new product
            } else {
                this.id = '_' + Math.random().toString(36).substr(2, 9);
                products.push(this);
                fs.writeFile(productsFile, JSON.stringify(products), err => { console.log(err); });
            }
        });
    }

    static deleteById(id) {
        getProductsFromFile(products => {
            const product = products.find(prod => prod.id === id);
            //Remove the product by filtering
            const updatedProducts = products.filter(prod => prod.id !== id);
            fs.writeFile(productsFile, JSON.stringify(updatedProducts), err => {
                if (!err) {
                    // Delete the product from cart once deleted from Products
                    Cart.deleteProduct(id, product.price);
                }
            });
        });
    }
};

module.exports = Product;
