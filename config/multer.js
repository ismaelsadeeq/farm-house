const multer  = require('multer');
const helpers = require('./helper');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        const extension = file.originalname.split('.');
        cb(null, Date.now()+'.'+extension[extension.length - 1])
    }
});


const singleUpload = multer({
    storage: storage, 
    limits: {fileSize: 1024 * 1024 },
    fileFilter: helpers.imageFilter
}).single('photoId');
const multipleUpload = multer({
    storage: storage, 
    limits: {fileSize: 1024 * 1024 },
    fileFilter: helpers.imageFilter
}).array('pictures', 5);
module.exports = {
    singleUpload,
    multipleUpload
}