var kafka = require('../kafka/client');
const express = require("express");
const router = express.Router();

router.post('/', function(req, res){
    console.log("req.body ------------", req.body);
    kafka.make_request('login',req.body, function(err,results){
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
            res.status(results.code).send(results);
        }
        
    });
});


module.exports = router;