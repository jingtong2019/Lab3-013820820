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

    var query = {
        'rid' : ObjectId(msg.rid),
        'cid' : ObjectId(msg.cid),
        'status': msg.status,
        'items': msg.items,
        'cname': msg.cname,
        'caddress': msg.caddress
    };

    collection.insert(query, {w:1}, function(err, result) {
        if(err){
            console.log(err);
            response.code = "202";
            response.value = "Can not add this order";
            callback(err,response);
        }
        else {
            response.code = "200";
            response.value = "Successfully added this order";
            callback(null,response);
        }
    });

    

}

exports.handle_request = handle_request;




