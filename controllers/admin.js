const Product = require('../models/products');

exports.getAddProduct = (req, res, next) => {
  // EJS file in views/
  res.render('admin/edit', {
    // Variables used inside the EJS File
    pageTitle: 'Add Product',
    path: '/admin/add',
    editing: false
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findByID(prodId, product => {
    if (!product) {
      return res.redirect('/');
    }
    // EJS file in views/
    res.render('admin/edit', {
      // Variables used inside the EJS File
      pageTitle: 'Edit Product',
      path: '/admin/edit',
      editing: editMode,
      product: product
    });
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll(products => {
    // EJS file in views/
    res.render('admin/products', {
      // Variables used inside the EJS File
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(null, title, imageUrl, description, price);
  product.save();
  res.redirect('/');
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const updatedProduct = new Product(
    prodId,
    updatedTitle,
    updatedImageUrl,
    updatedDesc,
    updatedPrice
  );
  updatedProduct.save();
  res.redirect('/admin/products');
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId);
  res.redirect('/admin/products');
};