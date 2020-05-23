const Product = require('../models/product');

const ITEMS_PER_PAGE = 3;

exports.getAddProduct = (req, res, next) => {
  // If the user is not logged in, don't provide the access
  // Instead of adding this to all methods, use custome middleware to inject in routes
  /*
  if (!req.session.isLoggedIn) { return res.redirect('/login'); } 
  */
  // EJS file in views/
  res.render('admin/edit', {
    // Variables used inside the EJS File
    pageTitle: 'Add Product',
    path: '/admin/add',
    editing: false,
    isAuthenticated: req.session.isLoggedIn
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  //Mongoose Provided Method -> findById()
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      // EJS file in views/
      res.render('admin/edit', {
        // Variables used inside the EJS File
        pageTitle: 'Edit Product',
        path: '/admin/edit',
        editing: editMode,
        product: product,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};

// exports.getProducts = (req, res, next) => {
//   // Only show products created by the current authenticated user
//   Product.find({ userId: req.user._id })
//     .then(products => {
//       // EJS file in views/
//       res.render('admin/products', {
//         // Variables used inside the EJS File
//         prods: products,
//         pageTitle: 'Admin Products',
//         path: '/admin/products',
//         isAuthenticated: req.session.isLoggedIn
//       });
//     })
//     .catch(err => console.log(err));
// };

exports.getProducts = (req, res, next) => {
  const page = +req.query.page || 1;
  let totalItems;
  // Only show products created by the current authenticated user
  Product.find({ userId: req.user._id })
    .countDocuments()
    .then(numProducts => {
      totalItems = numProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then(products => {
      // EJS file in views/
      res.render('admin/products', {
        // Variables used inside the EJS File
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        isAuthenticated: req.session.isLoggedIn,
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      });
    })
    .catch(err => {
      console.log(err)
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};


exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  });
  //Mongoose Provided Method -> save()
  product.save()
    .then(result => {
      console.log(result);
      res.redirect('/admin/products');
    })
    .catch(err => { console.log(err); });
};


/*
 CHANGE TO USE: findByIdAndUpdate() 
 */
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  //Mongoose Provided Method -> findById()
  Product.findById(prodId)
    .then(product => {

      //Check if the user who's trying to edit the product is the owner
      if (product.userId.toString() !== req.user._id.toString()) {
        //If not then redirect back to home
        return res.redirect('/');
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      return product.save().then(result => {
        console.log('Product Updates!');
        res.redirect('/admin/products');
      })
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  //Mongoose Provided Method -> findByIdAndRemove()
  //Product.findByIdAndRemove(prodId)
  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(() => {
      console.log(`Product ID: ${prodId} Deleted!`);
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};