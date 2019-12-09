'use strict';
// Include our packages in our main server file
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var passport = require('passport');
var cors = require('cors');
var app = express();


// Set up middleware
var requireAuth = passport.authenticate('jwt', {session: false});


// Use body-parser to get POST requests for API use
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());

// Log requests to console
app.use(morgan('dev'));

//require('./app/routes')(app);
app.use(passport.initialize());

// Bring in defined Passport Strategy
require('./config/passport')(passport);

var connection =  new require('./kafka/Connection');

//topics files
//var signin = require('./services/signin.js');
var Login = require('./services/login.js');
var Csignup = require('./services/csignup.js');
var Osignup = require('./services/osignup.js');
var Osignup2 = require('./services/osignup2.js');
var Menu = require('./services/menu.js');
var AddSection = require('./services/addSection.js');
var UpdateSection = require('./services/updateSection.js');
var DeleteSection = require('./services/deleteSection.js');
var AddItem = require('./services/addItem.js');
var UpdateItem = require('./services/updateItem.js');
var DeleteItem = require('./services/deleteItem.js');
var Oaccount1 = require('./services/oaccount1.js');
var Oaccount2 = require('./services/oaccount2.js');
var Oaccount3 = require('./services/oaccount3.js');
var Oaccount4 = require('./services/oaccount4.js');
var Account1 = require('./services/account1.js');
var Account2 = require('./services/account2.js');
var Account3 = require('./services/account3.js');
var Search = require('./services/search.js');
var Detail = require('./services/detail.js');
var GetCart = require('./services/getCart.js');
var Place = require('./services/place.js');
var Order = require('./services/order.js');
var Ohome = require('./services/ohome.js');
var OhomeChange = require('./services/ohomeChange.js');
var OhomeCancel = require('./services/ohomeCancel.js');
var Message = require('./services/message.js');
var GetOmessage = require('./services/getOmessage.js');
var GetCmessage = require('./services/getCmessage.js');

function handleTopicRequest(topic_name,fname){
    //var topic_name = 'root_topic';
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
    console.log('server is running ');
    consumer.on('message', function (message) {
        console.log('message received for ' + topic_name +" ", fname);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);
        
        fname.handle_request(data.data, function(err,res){
            console.log('after handle'+res);
            var payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : res
                    }),
                    partition : 0
                }
            ];
            producer.send(payloads, function(err, data){
                console.log(data);
            });
            return;
        });
        
    });
}
// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
handleTopicRequest("login",Login)
handleTopicRequest("csignup",Csignup)
handleTopicRequest("osignup",Osignup)
handleTopicRequest("osignup2",Osignup2)
handleTopicRequest("menu",Menu)
handleTopicRequest("addSection",AddSection)
handleTopicRequest("updateSection",UpdateSection)
handleTopicRequest("deleteSection",DeleteSection)
handleTopicRequest("addItem",AddItem)
handleTopicRequest("updateItem",UpdateItem)
handleTopicRequest("deleteItem",DeleteItem)
handleTopicRequest("oaccount1",Oaccount1)
handleTopicRequest("oaccount2",Oaccount2)
handleTopicRequest("oaccount3",Oaccount3)
handleTopicRequest("oaccount4",Oaccount4)
handleTopicRequest("account1",Account1)
handleTopicRequest("account2",Account2)
handleTopicRequest("account3",Account3)
handleTopicRequest("search",Search)
handleTopicRequest("detail",Detail)
handleTopicRequest("getCart",GetCart)
handleTopicRequest("place",Place)
handleTopicRequest("order",Order)
handleTopicRequest("ohome",Ohome)
handleTopicRequest("ohomeChange",OhomeChange)
handleTopicRequest("ohomeCancel",OhomeCancel)
handleTopicRequest("message",Message)
handleTopicRequest("getOmessage",GetOmessage)
handleTopicRequest("getCmessage",GetCmessage)