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
            usertype: "Customer",
            email: msg.email
        }, function (res) {
            response.code = "202";
            response.value = "User already exist";
            callback(null, response);
        }, function (err) {
            
            db.createUser(msg, function (res) {
                var user = {
                    id: res._id,
                    email: res.email,
                    usertype: "Customer"
                };
                console.log('res ---------', res)
                response.code = "200";
                response.value = "Successfully created new user";
                var token = jwt.sign(user, config.secret, {
                    expiresIn: 10080 // in seconds
                });
                response.token = 'JWT' + token;
                response.userid = res._id;
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







// var MongoClient = require('mongodb').MongoClient;

// function handle_request(msg, callback){
//     var res = {};
//     console.log("In handle request:"+ JSON.stringify(msg));
//     // Connect to the db
//     MongoClient.connect('mongodb://localhost/mydb', function(err, db) {
//       if(err) {
//         callback(null,"Cannot connect to db");
//       }
//       else {
//         console.log('Connected to mongodb');
//         customers = db.collection('customers');
//         console.log("msg -------------", msg);
//         var query = {'email' : msg.email, 'password': msg.password};
//         customers.insert(query, {w:1}, function(err, result) {
//             if(err){
//                 //throw err;
//                 callback(err,"Error");
//             }
//             else{
//                 callback(null,"Success");
//             }
//         });
//       }
//     });
// }

// exports.handle_request = handle_request;


