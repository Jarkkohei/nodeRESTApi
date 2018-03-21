const express = require('express');
const router = express.Router();

const Product = require('../models/product');
const mongoose = require('mongoose');

router.get('/', (req, res, next) => {
    Product.find().exec()
        .then(docs => {
            console.log(docs);
            //if(docs.length >= 0) {
                res.status(200).json(docs);
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
});


router.post('/', (req, res, next) => {

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Handling POST requests to /products',
            createdProduct: result
        });
    }).catch(error => {
        console.log(error);
        res.status(500).json({error: error});
    });
    
});


router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id).exec()
        .then(doc => {
            console.log(doc);
            if(doc) {
                res.status(200).json(doc);
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
});


router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for(const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id : id}, { $set: updateOps }).exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(error => {
            concole.log(error);
            res.status(500).json({
                error: error
            });
        });
});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id: id}).exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                error: error
            });
        });
});

module.exports = router;