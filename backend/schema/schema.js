const graphql = require('graphql');
const _ = require('lodash');
var kafka = require('../kafka/client');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;



const LoginType = new GraphQLObjectType({
    name: 'Login',
    fields: ( ) => ({
        userid: { type: GraphQLString },
        fname: { type: GraphQLString }
    })
});
const Osignup2Type = new GraphQLObjectType({
    name: 'Osignup2',
    fields: ( ) => ({
        code: { type: GraphQLString }
    })
});
const Account1Type = new GraphQLObjectType({
    name: 'Account1',
    fields: ( ) => ({
        email: { type: GraphQLString },
        fname: { type: GraphQLString },
        lname: { type: GraphQLString },
        phone: { type: GraphQLString },
        image_result: { type: GraphQLString },
    })
});
const Oaccount1Type = new GraphQLObjectType({
    name: 'Oaccount1',
    fields: ( ) => ({
        email: { type: GraphQLString },
        fname: { type: GraphQLString },
        lname: { type: GraphQLString },
        rname: { type: GraphQLString },
        phone: { type: GraphQLString },
        pimage_result: { type: GraphQLString },
        rimage_result: { type: GraphQLString },
        cuisine: { type: GraphQLString }
    })
});



const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        login: {
            type: LoginType,
            args: { email: { type: GraphQLString}, password: {type: GraphQLString}, usertype: {type: GraphQLString}},
            resolve(parent, args) {
                console.log('args', args);
                let res = {};
                kafka.make_request('login', args, function(err,results){
                    if (err){
                        res.userid = "-1";
                        res.fname = "error";
                    }else{
                        res.userid = results.userid;
                        res.fname = results.fname;

                    }
                    return res;
                });
            }
        },
        csignup: {
            type: LoginType,
            args: { email: { type: GraphQLString}, password: {type: GraphQLString}},
            resolve(parent, args) {
                console.log('args', args);
                let res = {};
                kafka.make_request('csignup', args, function(err,results){
                    if (err){
                        res.userid = "-1";
                        res.fname = "error";
                    }else{
                        res.userid = results.userid;
                        res.fname = results.fname;

                    }
                    return res;
                });
            }
        },
        osignup: {
            type: LoginType,
            args: { email: { type: GraphQLString}, password: {type: GraphQLString}},
            resolve(parent, args) {
                console.log('args', args);
                let res = {};
                kafka.make_request('osignup', args, function(err,results){
                    if (err){
                        res.userid = "-1";
                        res.fname = "error";
                    }else{
                        res.userid = results.userid;
                        res.fname = results.fname;

                    }
                    return res;
                });
            }
        },
        osignup2: {
            type: Osignup2Type,
            args: { userid: { type: GraphQLString}, rname: {type: GraphQLString}, address: {type: GraphQLString}, phone: {type: GraphQLString}},
            resolve(parent, args) {
                console.log('args', args);
                kafka.make_request('osignup2', args, function(err,results){
                    return results;
                });
            }
        },
        account1: {
            type: Account1Type,
            args: { userid: { type: GraphQLString}},
            resolve(parent, args) {
                console.log('args', args);
                kafka.make_request('account1', args, function(err,results){
                    if (!err) {
                        return results;
                    }
                });
            }
        },
        account2: {
            type: Osignup2Type,
            args: { userid: { type: GraphQLString}, email: { type: GraphQLString}, fname: { type: GraphQLString}, lname: { type: GraphQLString}, phone: { type: GraphQLString}},
            resolve(parent, args) {
                console.log('args', args);
                kafka.make_request('account2', args, function(err,results){
                    if (!err) {
                        return results;
                    }
                });
            }
        },

        oaccount1: {
            type: Oaccount1Type,
            args: { userid: { type: GraphQLString}},
            resolve(parent, args) {
                console.log('args', args);
                kafka.make_request('oaccount1', args, function(err,results){
                    if (!err) {
                        return results;
                    }
                });
            }
        },

        oaccount2: {
            type: Osignup2Type,
            args: { userid: { type: GraphQLString}, email: { type: GraphQLString}, fname: { type: GraphQLString}, lname: { type: GraphQLString}, phone: { type: GraphQLString}, rname: { type: GraphQLString}, cuisine: { type: GraphQLString}},
            resolve(parent, args) {
                console.log('args', args);
                kafka.make_request('oaccount2', args, function(err,results){
                    if (!err) {
                        return results;
                    }
                });
            }
        },
    
    }
});

module.exports = new GraphQLSchema({
    mutation: Mutation
});