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
    let query = { $match : {  "menus.name" :  new RegExp(msg.to_search) } };
    //let query = { $match : {  menus : {$elemMatch: {name:  new RegExp(msg.to_search)}} } };
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
            response.value = "failed to search";
            callback(err,response);
        }
        else {
            response.code = "200";
            response.value = "Successfully searched";
            console.log("result========", res);
            let info = [];
            for (let i = 0; i < res.length; i++) {
                let section_info = {};
                section_info.rid = res[i].rid;
                section_info.rname = res[i].newform[0].rname;
                section_info.cuisine = res[i].newform[0].cuisine;
                for (let j = 0; j < res[i].menus.length; j++) {
                    if (res[i].menus[j].name.includes(msg.to_search)) {
                        let all_info = {
                            ...section_info,
                            name: res[i].menus[j].name
                        };
                        info.push(all_info);
                    }
                }
            }
            response.number = info.length;
            response.info = info;
            //console.log("info============", info);
            callback(null,response);
        }
    });
    
     


}

exports.handle_request = handle_request;




