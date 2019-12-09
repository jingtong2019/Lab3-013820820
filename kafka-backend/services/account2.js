var MongoClient = require('mongodb').MongoClient;
var mydb;
var config = require('../config/settings');
var ObjectId = require('mongodb').ObjectID;

MongoClient.connect(config.mongodb, config.dbsetting, function(err, database) {
  if(err) throw err;
  mydb = database;
});

function handle_request(msg, callback){
    var response = {};
    console.log("In handle request:"+ JSON.stringify(msg));
    let collection = mydb.collection('customers');
    let query = {'_id': ObjectId(msg.userid)};
    let info = { $set:
        {
          fname: msg.fname,
          lname: msg.lname,
          email: msg.email,
          phone: msg.phone
        }
    };
    collection.update(query, info, function(err, res) {
        if (err) {
            response.code = "202";
            response.value = "Can not find the owner";
            callback(err,response);
        }
        else {
            response.code = "200";
            response.value = "update the info successfully";
            callback(null,response);
        }
    });

}

exports.handle_request = handle_request;




