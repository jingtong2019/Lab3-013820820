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
    collection.find({oid: msg.userid}, { "_id": 1, "rname": 1}).toArray(function(err,res){
        if (err) {
            response.code = "202";
            response.value = "Can not get order info";
            callback(err,response);
        }
        else {
            let orders = mydb.collection('orders');
            let rid_to_search = res[0]._id;
            response.rid = rid_to_search;
            response.rname = res[0].rname;
            let query = { $and : [ { status : { $ne: "delivered" } }, { status : { $ne: "cancelled" } }, { rid : rid_to_search} ] };
            if (msg.past) {
                query = { $and : [ {$or : [ { status : "delivered" }, { status : "cancelled" } ] }, {rid : rid_to_search}] };
            }
            orders.find(query, {"_id": 1, "items": 1, "cid": 1, "cname": 1, "caddress" : 1, "status": 1}).toArray(function(err,result){
                if (err) {
                    response.code = "202";
                    response.value = "Can not get order info";
                    callback(err,response);
                }
                else {
                    response.code = "200";
                    response.value = "Successfully get order info";
                    response.number = result.length;
                    response.result = result;
                    
                    
                    callback(null,response);
                    
                }
            });
        }
    });

}

exports.handle_request = handle_request;




