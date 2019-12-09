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
    let collection = mydb.collection('sections');
    
    let query = { _id: ObjectId(msg.sid), "menus.mid": ObjectId(msg.mid) };
    let info = { $set: 
        { 
            "menus.$.name": msg.name, 
            "menus.$.description": msg.description, 
            "menus.$.price": msg.price, 
            "menus.$.menu_image": msg.image.data
        }
    };
    collection.updateOne(query, info, function(err, result){
        if (err) {
            response.code = "202";
            response.value = "Can not add menu";
            callback(err,response);
        }
        else {
            response.code = "200";
            response.value = "Successfully added this menu";
            callback(null,response);
        }

    });

}

exports.handle_request = handle_request;




