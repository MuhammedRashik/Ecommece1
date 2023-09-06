const multer  = require('multer')
const path = require('path')
const storage = multer.diskStorage({
    destination: function(req, file, callback) {
      callback(null, 'public/admin/assets/imgs/catogary');
    },
    filename: function (req, file, callback) {
      callback(null,  file.fieldname + '-' + Date.now() + path.extname(file.originalname))}
  });



  const upload=multer({storage:storage})

  module.exports={upload}