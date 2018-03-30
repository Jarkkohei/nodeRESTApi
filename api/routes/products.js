const express = require('express');
const router = express.Router();

const multer = require('multer');
const checkAuth = require('./../middleware/check-auth');

const ProductsController = require('./../controllers/products');


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        //  Windows does not allow semicolons (:) in filenames.
        const now = new Date().toISOString(); 
        const date = now.replace(/:/g, '-'); 
        cb(null, date + '-' + file.originalname);
    }
});


const fileFilter = (req, file, cb) => {

    if(file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        //  Accept a file
        cb(null, true);
    } else {
        //  Reject a file
        cb(null, false);
    
    }
    
};


const upload = multer({
    storage: storage, 
    limits: {fileSize: 1024 * 1024 * 2 },
    fileFilter: fileFilter
    });


router.get('/', ProductsController.produts_get_all);

router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create_product);

router.get('/:productId', ProductsController.products_get_product);

router.patch('/:productId', checkAuth, ProductsController.products_update_product);

router.delete('/:productId', checkAuth, ProductsController.products_delete_product);




module.exports = router;