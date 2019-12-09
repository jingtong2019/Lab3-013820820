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

    var query = {
        'rid' : ObjectId(msg.rid),
        'rname' : msg.rname,
        'cid' : ObjectId(msg.cid),
        'cname' : msg.cname,
        'ctor': msg.ctor,
        'message': msg.message,
        'sent_time': new Date()
    };

    collection.insert(query, {w:1}, function(err, result) {
        if(err){
            console.log(err);
            response.code = "202";
            response.value = "Can not add this message";
            callback(err,response);
        }
        else {
            response.code = "200";
            response.value = "Successfully added this message";
            callback(null,response);
        }
    });

    

}

exports.handle_request = handle_request;




