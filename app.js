const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

mongoose.connect('mongodb://Admin:' + 
    process.env.MONGO_ATLAS_PW + 
    '@node-rest-shop-shard-00-00-dcwi5.mongodb.net:27017,node-rest-shop-shard-00-01-dcwi5.mongodb.net:27017,node-rest-shop-shard-00-02-dcwi5.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-shop-shard-0&authSource=admin'
);
mongoose.Promise = global.Promise;

app.use(morgan('dev'));

//  Make "uploads"-folder publicly available.
app.use('/uploads', express.static('uploads'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Set CORS handling
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    // Set allowed methods
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});




app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});



module.exports = app;