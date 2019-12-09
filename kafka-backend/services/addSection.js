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

    var query = {'rid' : ObjectId(msg.rid), 'sname': msg.section_name};

    collection.find(query).toArray(function(err,res){
        if (err) {
            response.code = "202";
            response.value = "Can not find this section";
            callback(err,response);
        }
        else if (res.length > 0) {
            response.code = "202";
            response.value = "This section already exists";
            callback(null,response);
        } else {
            collection.insert(query, {w:1}, function(err, result) {
                if(err){
                    console.log(err);
                    response.code = "202";
                    response.value = "Can not add this section";
                    callback(err,response);
                }
                else {
                    response.code = "200";
                    response.value = "Successfully added this section";
                    callback(null,response);
                }
            });
        }
    });

    

}

exports.handle_request = handle_request;




