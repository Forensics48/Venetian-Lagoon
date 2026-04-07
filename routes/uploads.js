const express = require('express');
var multer = require('multer');
const router = express.Router();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var directory = req.headers['directory'];
        cb(null, './public/assets/img/' + directory + '/');
    },
    filename: function (req, file, cb) {
        console.log(req.headers);
        var fileName = req.headers['filename'];
        cb(null, fileName);
    }
});

const upload = multer({
    storage: storage
});

router.post('/uploadImage/', upload.single('image'),function(req, res) {
    console.log(req.file);
    res.send(req.file);
});

module.exports = router;