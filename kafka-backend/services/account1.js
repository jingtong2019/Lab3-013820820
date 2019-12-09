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
    let query = {'_id': ObjectId(msg.userid)}
    collection.find(query).toArray(function(err,res){
        if (err) {
            response.code = "202";
            response.value = "Can not find the owner";
            callback(err,response);
        }
        else {
            response.code = "200";
            response.value = "Got all info";
            response.fname = res[0].fname;
            response.lname = res[0].lname;
            response.email = res[0].email;
            if ('profile_image' in res[0]) {
                //console.log("image----------", res[0].profile_image);
                const buf1 = new Buffer.from(res[0].profile_image.data, "binary");
                console.log("image----------", buf1);
                response.image_result = buf1.toString('base64');
            }
            else {
                response.image_result = "no image";
            }
            if ('phone' in res[0]) {
                response.phone = res[0].phone;
            }
            else {
                response.phone = "";
            }
            callback(null,response);
            
        }

    });

}

exports.handle_request = handle_request;




