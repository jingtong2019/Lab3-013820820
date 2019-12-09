'use strict';
//var mysql = require('mysql');
var crypt = require('./crypt');
var config = require('../config/settings');
var db = {};
// Creating a connection object for connecting to mysql database
var MongoClient = require('mongodb').MongoClient;
var mydb;

// Initialize connection once
MongoClient.connect(config.mongodb, config.dbsetting, function(err, database) {
  if(err) throw err;
  mydb = database;
});

db.createUser = function (user, successCallback, failureCallback) {
    var passwordHash;
    crypt.createHash(user.password, function (res) {
        passwordHash = res;
        user.password = passwordHash;
        let collection = mydb.collection('customers');
        if (user.usertype === "Restaurant Owner"){
            console.log('usertype----owner');
            collection = mydb.collection('owners');
        }
        var query = user; //{'email' : user.email, 'password': passwordHash, 'fname': user.fname, 'lname': user.lname};
        collection.insert(query, {w:1}, function(err, result) {
            if(err){
                console.log(err);
                failureCallback(err);
                return;
            }
            var query2 = {'email' : user.email};
            collection.find(query2).toArray(function(err,result){
                successCallback(result[0]);
            });
            
        });
    }, function (err) {
        console.log(err);
        failureCallback(err);
    });
};

db.findUser = function (user, successCallback, failureCallback) {
    console.log('user --------', user);
    let collection = mydb.collection('customers');
    if (user.usertype === "Restaurant Owner"){
        console.log('usertype----owner');
        collection = mydb.collection('owners');
    }

    var query = {'email' : user.email};
    collection.find(query).toArray(function(err,result){
        if (err) {
            failureCallback(err);
            return;
        }
        if (result.length > 0) {
            successCallback(result[0])
        } else {
            failureCallback('User not found.');
        }
    });
};

module.exports = db;