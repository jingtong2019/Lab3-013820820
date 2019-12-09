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

    let query = {'rid' : ObjectId(msg.rid)};
    collection.find(query).toArray(function(err,result){
        if (err) {
            response.code = "202";
            response.value = "Can not find sections";
            callback(err,response);
        }
        else {
            let sid_list = [];
            let sname_list = [];
            let info = [];
            for (let i=0; i< result.length; i++) {
                sid_list.push(result[i]._id);
                sname_list.push(result[i].sname);
                if ('menus' in result[i] && result[i].menus.length != 0) {
                    for (let j=0; j < result[i].menus.length; j++) {
                        const buf = new Buffer.from(result[i].menus[j].menu_image, "binary");
                        let image = buf.toString('base64');
                        result[i].menus[j].menu_image = image;
                    }
                    info.push(result[i].menus);
                }
                else {
                    info.push([]);
                }
                
            }
            response.code = "200";
            response.value = "Successfully find sections";
            response.sid_list = sid_list;
            response.sname_list = sname_list;
            response.info = info;
            response.section_number = result.length;
            callback(null,response);
        }
    });

}

exports.handle_request = handle_request;




