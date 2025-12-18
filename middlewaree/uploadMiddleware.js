const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({

    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },

    filename: function(req, file, cb) {
        let ext = path.extname(file.originalname)
        cb(null, Date.now() + ext)
    }

});


const upload = multer({

    storage: storage,

    fileFilter: function(req, file, cb) {
        if (
            file.mimetype == "image/jpg" || 
            file.mimetype == "image/jpeg" || 
            file.mimetype == "image/png"
        ) {
            cb(null, true);
        } else {
            console.log("Формат данного файла не поддерживается!");
            cb(null, false);
        }
    },

    limits: {
        fileSize: 1024 * 1024 * 2
    }

});

module.exports = upload
