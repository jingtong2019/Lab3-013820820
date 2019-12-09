var kafka = require('../kafka/client');
const express = require("express");
const router = express.Router();
var path = require('path');
var multer = require('multer');
var fs = require("fs");
var storage = multer.diskStorage({
    destination: '../uploads/',
    filename: function(req, file, cb){
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
  
const upload = multer({ storage });

router.post('/', upload.single('myImage'), (req, res) => {
    //console.log("test", req.body, req.file.path);
    let values = fs.readFileSync(req.file.path);
    //console.log("image -------", values);
    req.body.image = values;
    kafka.make_request('addItem',req.body, function(err,results){
        console.log('in result');
        console.log(results);
        if (err){
            console.log("Inside err");
            res.json({
                status:"error",
                msg:"System Error, Try Again."
            })
        }else{
            console.log("Inside else");
            fs.unlinkSync(req.file.path);
            res.status(results.code).send(results);
        }
        
    });
});


module.exports = router;