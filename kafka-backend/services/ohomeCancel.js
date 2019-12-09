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
    let collection = mydb.collection('orders');

    collection.update({ _id: ObjectId(msg.order_id)},
        { $set: { "status": "cancelled" }}, function(err, result){
        if(err){
            console.log(err);
            response.code = "202";
            response.value = "Can not cancel";
            callback(err,response);
        }
        else {
            response.code = "200";
            response.value = "Successfully cancel this order";
            callback(null,response);
        }
    });
    

}

exports.handle_request = handle_request;