var db = require('../app/db');
var crypt = require('../app/crypt');
var jwt = require('jsonwebtoken');
var config = require('../config/settings');

// Initialize connection once
// MongoClient.connect('mongodb://localhost/mydb', function(err, database) {
//   if(err) throw err;
//   mydb = database;
// });

function handle_request(msg, callback){
  var response = {};
  console.log("In handle request:"+ JSON.stringify(msg));

  db.findUser({
      usertype: msg.usertype,
      email: msg.email
  }, function (res) {
      //console.log("res --------------------", res);
      var user = {
          id: res._id,
          email: res.email,
          usertype: msg.usertype
      };

      // Check if password matches
      crypt.compareHash(msg.password, res.password, function (err, isMatch) {
          if (isMatch && !err) {
              // Create token if the password matched and no error was thrown
              var token = jwt.sign(user, config.secret, {
                  expiresIn: 10080 // in seconds
              });
              response.code = "200";
              response.value = "Successfully login";
              response.token = 'JWT' + token;
              response.userid = res._id;
              response.fname = res.fname;
              callback(null, response);
          } else {
              response.code = '202';
              response.value = "Authentication failed. Passwords did not match";
              callback(err, response);
          }
      });
  }, function (err) {
      console.log(err);
      response.code = "202";
      response.value = "Authentication failed. User not found";
      callback(err, response);
  });

  // var query = {email : msg.email};
  // console.log("email", msg.email);
  // customers.find(query).toArray(function(err,result){
  //     if(err){
  //         //throw err;
  //         callback(err,"Error");
  //     }
  //     if(result.length > 0){
  //         console.log(result);
  //         var pd = result[0].password;
  //         console.log("password:-----------", pd);
  //         callback(null,result);
  //     }
  //     else{
  //         callback(null,[]);
  //     }
  // });

}

//var bcrypt = require('bcrypt');

// function handle_request(msg, callback){
//   res = {};
//   if(msg.email == "tongjing2014@gmail.com" && msg.password =="1234"){
//     res.code = "200";
//     res.value = "Success Login";

//   }
//   else{
//       res.code = "401";
//       res.value = "Failed Login";
//   }
//   callback(null, res);
// };

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
//         var query = {email : msg.email};
//         console.log("email", msg.email);
//         customers.find(query).toArray(function(err,result){
//             if(err){
//                 //throw err;
//                 callback(err,"Error");
//             }
//             if(result.length > 0){
//                 console.log(result);
//                 var pd = result[0].password;
//                 console.log("password:-----------", pd);
//                 callback(null,result);
//             }
//             else{
//                 callback(null,[]);
//             }
//         });
//       }
//     });

// }

exports.handle_request = handle_request;


