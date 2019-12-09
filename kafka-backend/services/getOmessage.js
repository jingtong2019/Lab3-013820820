var MongoClient = require('mongodb').MongoClient;
var mydb;
var config = require('../config/settings');
var ObjectId = require('mongodb').ObjectID;

// Initialize connection once
MongoClient.connect(config.mongodb, config.dbsetting, function(err, database) {
  if(err) throw err;
  mydb = database;
});


function handle_request(msg, callback){
    var response = {};
    console.log("In handle request:"+ JSON.stringify(msg));
    let collection = mydb.collection('messages');

    let query = {"rid" : ObjectId(msg.rid), "ctor": true};
    collection.find(query).sort({"sent_time": -1}).toArray(function(err,result){
        if (err) {
            response.code = "202";
            response.value = "Can not find messages";
            callback(err,response);
        }
        else {
            //console.log("result -----------", result);
            response.code = "200";
            response.value = "Successfully find messages";
    
            response.result = result;
            response.number = result.length;
            callback(null,response);
        }
    });

}

exports.handle_request = handle_request;




