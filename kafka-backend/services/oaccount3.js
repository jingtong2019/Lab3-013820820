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
    let collection = mydb.collection('owners');
    console.log('msg---------', msg);
    collection.update({ _id: ObjectId(msg.userid)},
        { $set: { "profile_image": msg.image }}, function(err, result){
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


//     var newImg = fs.readFileSync(req.file.path);
//    // encode the file as a base64 string.
//     var encImg = newImg.toString('base64');
//    // define your new document
//     var newItem = {
//       description: req.body.description,
//       contentType: req.file.mimetype,
//       size: req.file.size,
//       img: Buffer(encImg, 'base64')
//     };
//     collection.insert(newItem, function(err, result){
//     if (err) { console.log(err); };
//         var newoid = new ObjectId(result.ops[0]._id);
//         fs.remove(req.file.path, function(err) {
//             if (err) { console.log(err) };
//             res.render('index', {title:'Thanks for the Picture!'});
//             });
//         });
//     });

    

}

exports.handle_request = handle_request;




