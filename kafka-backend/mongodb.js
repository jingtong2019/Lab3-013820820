var mongo = require('mongoose');

mongo.Promise = global.Promise;

mongo.connect('mongodb://localhost/mydb', 
{ useNewUrlParser: true, poolSize: 10 } ).then(
    () => {
        console.log("Getting MongoDB Connection!!!")
    },
    err => {
        console.log("Connection Failed!. Error: ${err}")
    }
);

module.exports = {
    mongo,
};