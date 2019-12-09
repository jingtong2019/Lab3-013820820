var db = require('../app/db');
var jwt = require('jsonwebtoken');
var config = require('../config/settings');

function handle_request(msg, callback){
    var response = {};
    console.log("In handle request:"+ JSON.stringify(msg));

    if (!msg.email || !msg.password) {
        response.code = "202";
        response.value = "Please enter username and password";
        callback(err,response);
    } else {
        db.findUser({
            usertype: "Restaurant Owner",
            email: msg.email
        }, function (res) {
            response.code = "202";
            response.value = "User already exist";
            callback(null, response);
        }, function (err) {
            db.createUser({...msg, usertype: "Restaurant Owner"}, function (res) {
                var user = {
                    id: res._id,
                    email: res.email,
                    usertype: "Restaurant Owner"
                };
                response.code = "200";
                response.value = "Successfully created new user";
                var token = jwt.sign(user, config.secret, {
                    expiresIn: 10080 // in seconds
                });
                response.token = 'JWT' + token;
                response.userid = res._id;
                //console.log('res ---------', response.userid)
                response.fname = res.fname;
                callback(null,response);
            }, function (err) {
                console.log(err);
                response.code = "202";
                response.value = "That username address already exists";
                callback(err,response);
            });
        });

        // Attempt to save the user
        
        // db.findUser({
        //     username: msg.email
        // }, function (res) {
        //     var token = jwt.sign(user, config.secret, {
        //         expiresIn: 10080 // in seconds
        //     });
        //     response.code = "200";
        //     response.value = "Successfully login";
        //     response.token = 'JWT' + token;
        //     response.userid = res._id;
        //     response.fname = res.fname;
        //     callback(null, response);
        // }, function (err) {
        //     console.log(err);
        //     response.code = "202";
        //     response.value = "User not found";
        //     callback(err, response);
        // });

    }

}

exports.handle_request = handle_request;




