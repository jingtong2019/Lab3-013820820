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
    let cart = msg.cart;
    console.log("cart", cart);
    let mycart = {};
    let item_List = cart.split(/;/);
    for (let i=0; i < item_List.length-1; i++) {
        let item = item_List[i].split(/,/);
        if (item[0] in mycart) {
            mycart[item[0]] += parseInt(item[2]);
        }
        else {
            mycart[item[0]] = parseInt(item[2]);
        }
    }
    console.log("mycart", mycart);
    let items = [];
    for (let key in mycart) {
        items.push(ObjectId(key));
    }
    
    console.log("item", items);



    var response = {};
    console.log("In handle request:"+ JSON.stringify(msg));
    let collection = mydb.collection('sections');

    let query = {"menus.mid" : { $in : items }};
    let condition = {menus: {$elemMatch: {mid: { $in : items }}}};
    collection.find(query, condition).toArray(function(err,result){
        if (err) {
            response.code = "202";
            response.value = "Can not find sections";
            callback(err,response);
        }
        else {
            console.log("result -----------", result);
            response.code = "200";
            response.value = "Successfully find sections";
            info = [];
            for (let i = 0; i < result.length; i++) {
                const buf = new Buffer.from(result[i].menus[0].menu_image, "binary");
                let image = buf.toString('base64');
                result[i].menus[0].menu_image = image;
                result[i].menus[0].quantity = mycart[result[i].menus[0].mid];
                info.push(result[i].menus[0]);
            }
            response.item_list = info;
            response.item_number = info.length;
            callback(null,response);
        }
    });

}

exports.handle_request = handle_request;




