const mongoose = require('mongoose');

const Product = require('./../models/product');


exports.produts_get_all = (req, res, next) => {
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    };
                })
            };
            //if(docs.length >= 0) {
                res.status(200).json(response);
            //} else {
            //    res.status(404).json({
            //        message: 'No valid entries found'
            //    });
            //}
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        });
};


exports.products_create_product = (req, res, next) => {

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save().then(result => {
        //console.log(result);
        res.status(201).json({
            message: 'Product created successfully',
            createdProduct: {
                name: result.name,
                price: result.price,
                id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products' + result._id
                }


            }
        });
    }).catch(error => {
        console.log(error);
        res.status(500).json({error: error});
    });  
};


exports.products_get_product = (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            console.log(doc);
            if(doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products'
                    }
                });
            } else {
                res.status(404).json({
                    message: 'No valid entry found for provided ID'
                });
            }
           
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({error: error});
        });
};


exports.products_update_product = (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id : id}, { $set: updateOps }).exec()
        .then(result => {
            res.status(200).json({
                message: 'Product updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + id
                }
            });
        })
        .catch(error => {
            concole.log(error);
            res.status(500).json({
                error: error
            });
        });
};


exports.products_delete_product = (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id: id}).exec()
        .then(result => {
            res.status(200).json({
                message: 'Product deleted',
                request: {
                    type: 'POST',
                    url: 'http:localhost:3000/produtcs',
                    body: { name: 'String', price: 'Number' }
                }
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        });
};