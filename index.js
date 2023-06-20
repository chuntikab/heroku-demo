//test
const express = require('express');
const app = express();
const bodyParser= require('body-parser');
const PORT = process.env.PORT || 3000 ;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/', (req, res) => {
    const str="I AM AN ENDPOINT FOR YOUR SALESFORCE APPLICATION";
    res.send(str);
});
app.post('/updateaccount', (req, res) => {
   
    console.log(req.body);
    const data=req.body;
    if(JSON.stringify(data) != '{}'){
        res.send(data);
        //echoing the request data back as response
    }
    else{
        res.send('No data Received');
    }
});
app.post('/deleteaccount', (req, res) => {
   
    console.log(req.body);
    const data=req.body;
    if(JSON.stringify(data) != '{}'){
        res.send(data);
        //echoing the request data back as response
    }
    else{
        res.send('No data Received---deelete');
    }
});
app.listen(PORT, () => {
    console.log(`Listening on ${ PORT }`);
});


/*
var express = require( 'express' ); //Adding Express
var http = require( 'http' ); //Adding http
var jsforce = require('jsforce'); //Adding JsForce
var app = express();
console.log('jsforce--'+jsforce);
app.set( 'port', process.env.PORT || 3001 );
try
{
    app.get('/', function (req, res) {
        var conn = new jsforce.Connection({
        // you can change loginUrl to connect to sandbox or prerelease env.
         loginUrl : 'https://test.salesforce.com'
        });
        console.log('conn--'+conn);
        var username = 'sfdc-thaioil.r2@roundtwosolutions.com.devapex';
        var password = 'sfdc@r22020';
        conn.login(username, password, function(err, userInfo) {
        if (err) { return console.error(err); }
        // Now you can get the access token and instance URL information.
        // Save them to establish a connection next time.
        console.log(conn.accessToken);
        console.log(conn.instanceUrl);
        // logged in user property
        console.log("User ID: " + userInfo.id);
        console.log("Org ID: " + userInfo.organizationId);
        res.send('heySalesforce : JSForce Connect Successed!');
        });
        });
}
catch(err)
{
    console.log("error--- " + err.message());
}

http.createServer( app ).listen( app.get( 'port' ), function (){
console.log( 'Express server listening on port ' + app.get( 'port' ));
});
*/


