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
    if (msg.cid === "undefined") {
        response.code = "202";
        response.value = "failed to get order";
        callback(null,response);
        return;
    }
    let collection = mydb.collection('orders');

    let query = { $match : { $and : [ { status : { $ne: "delivered" } }, { status : { $ne: "cancelled" } }, { cid : ObjectId(msg.cid)} ] } };
    if (msg.past) {
        //console.log('=======================', msg.past);
        query = { $match : { $and : [ {$or : [ { status : "delivered" }, { status : "cancelled" } ] }, {cid : ObjectId(msg.cid)}] } };
    }
    collection.aggregate([
        query,
        {
           $lookup:
            {
              from: "restaurants",
              localField: "rid",
              foreignField: "_id",
              as: "newform"
            }
       }
    ]).toArray(function(err, res) {
        if (err) {
            response.code = "202";
            response.value = "failed to get order";
            callback(err,response);
        }
        else {
            response.code = "200";
            response.value = "Successfully get order";
            //console.log("result========", res);
            let info = [];
            for (let i = 0; i < res.length; i++) {
                let order = {};
                order.status = res[i].status;
                order.items = res[i].items;
                order.rname = res[i].newform[0].rname;
                order.rid = res[i].rid;
                info.push(order);
            }

            response.number = info.length;
            response.result = info;
            //console.log("info============", info);
            callback(null,response);
        }
    });
}

exports.handle_request = handle_request;




