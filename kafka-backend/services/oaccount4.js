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
    let collection = mydb.collection('restaurants');
    //console.log('msg---------', msg);
    collection.update({ oid: msg.userid},
        { $set: { "restaurant_image": msg.image }}, function(err, result){
            if (err) {
                response.code = "202";
                response.value = "Can not add image";
                callback(err,response);
            }
            else {
                response.code = "200";
                response.value = "Successfully added this image";
                callback(null,response);
            }

        });

}

exports.handle_request = handle_request;




