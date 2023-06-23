//test
const express = require('express');
const app = express();
const bodyParser= require('body-parser');
const PORT = process.env.PORT || 3000 ;
var http = require('http'); //Adding http
var jsforce = require('jsforce'); //Adding JsForce

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//GET
/*app.get('/', (req, res) => {
    const str="I AM AN ENDPOINT FOR YOUR SALESFORCE APPLICATION";
    res.send(str);

    var conn = new jsforce.Connection({
        // you can change loginUrl to connect to sandbox or prerelease env.
        loginUrl: 'https://test.salesforce.com'
    });
    var username = 'sfdc-thaioil.r2@roundtwosolutions.com.devapex';
    var password = 'sfdc@r22020';

    conn.login(username, password, function (err, userInfo) {
        if (err) {
            return console.error(err);
        }
        // Now you can get the access token and instance URL information.
        // Save them to establish a connection next time.
        console.log("accessToken: "+ conn.accessToken);
        console.log("instanceUrl: "+ conn.instanceUrl);
        // logged in user property
        console.log("User ID: " + userInfo.id);
        console.log("Org ID: " + userInfo.organizationId);

        //Perform SOQL Here 
        var records = [];
        conn.query("SELECT Id, Name FROM Account", function (err, result) {
            if (err) {
                return console.error(err);
            }
            console.log("total : " + result.totalSize);
            console.log("fetched : " + result.records.length);
        });

    })
});*/

//Sol1
app.get('/querymore', (req, res) => {
    const str="Query More - ";
    // res.send(str);

    var conn = new jsforce.Connection({
        // you can change loginUrl to connect to sandbox or prerelease env.
        loginUrl: 'https://test.salesforce.com'
    });
    var username = 'sfdc-thaioil.r2@roundtwosolutions.com.devapex';
    var password = 'sfdc@r22020';

    conn.login(username, password, function (err, userInfo) {

        if (err) {return console.error(err);}
        console.log("accessToken: "+ conn.accessToken);
        console.log("instanceUrl: "+ conn.instanceUrl);
        console.log("User ID: " + userInfo.id);
        console.log("Org ID: " + userInfo.organizationId);

        var records = [];
        var query = conn.query("SELECT Id, Name__c,CreatedBy.Name FROM PTW_Inspection_Report__c")
        .on("record", function(record) {
            records.push(record);
        })
        .on("end", function() {
            console.log("total in database : " + query.totalSize);
            console.log("total fetched : " + query.totalFetched);
            // console.log("total records : " + JSON.stringify(records));

            for(var i = 0 ; i < records.length ; i++ )
            {
                // console.log(records[0].CreatedBy.Name);
                records[i].Name__c = 'heroku'+records[i].Id;
            }
            res.send(str+records[0].Id);
            // conn.sobject("PTW_Inspection_Report__c").update(req.body,

            //     function(err, rets) {
            //       if (err) { return console.error(err); }
            //       for (var i=0; i < rets.length; i++) {
            //         if (rets[i].success) {
            //           console.log("Updated Successfully : " + rets[i].id);
            //           res.send("Updated Successfully");
            //         }
            //       }
            // });
        })
        .on("error", function(err) {
            console.error(err);
        })
        .run({ autoFetch : true, maxFetch : 1000000 });

        // res.send(str+" done");
    });
});

app.post('/autorunupdate', (req, res) => {
    const str="Query More - ";
    // res.send(str);

    var conn = new jsforce.Connection({
        // you can change loginUrl to connect to sandbox or prerelease env.
        loginUrl: 'https://test.salesforce.com'
    });
    var username = 'sfdc-thaioil.r2@roundtwosolutions.com.devapex';
    var password = 'sfdc@r22020';

    conn.login(username, password, function (err, userInfo) {

        if (err) {return console.error(err);}
        console.log("accessToken: "+ conn.accessToken);
        console.log("instanceUrl: "+ conn.instanceUrl);
        console.log("User ID: " + userInfo.id);
        console.log("Org ID: " + userInfo.organizationId);

        /*var records = [];
        var query = conn.query("SELECT Id, Name__c,CreatedBy.Name FROM PTW_Inspection_Report__c WHERE Id=\'a22N0000001s2iCIAQ\'")
        .on("record", function(record) {
            records.push(record);
        })
        .on("end", function() {
            console.log("total in database : " + query.totalSize);
            console.log("total fetched : " + query.totalFetched);
            // console.log("total records : " + JSON.stringify(records));

            for(var i = 0 ; i < records.length ; i++ )
            {
                // console.log(records[0].CreatedBy.Name);
                records[i].Name__c = 'heroku'+records[i].Id;
            }
            res.send(str+records[0].Id);*/

            console.log(req.body);
            conn.sobject("PTW_Inspection_Report__c").update(req.body,

                function(err, rets) {
                  if (err) { return console.error(err); }
                  for (var i=0; i < rets.length; i++) {
                    if (rets[i].success) {
                      console.log("Updated Successfully : " + rets[i].id);
                      res.send("Updated Successfully");
                    }
                  }
            });
        /*})
        .on("error", function(err) {
            console.error(err);
        })
        .run({ autoFetch : true, maxFetch : 1000000 });*/

        // res.send(str+" done");
    });
});

//Sol2
/*app.get('/', (req, res) => {
    const str="Query More";
    // res.send(str);

    var conn = new jsforce.Connection({
        // you can change loginUrl to connect to sandbox or prerelease env.
        loginUrl: 'https://test.salesforce.com'
    });
    var username = 'sfdc-thaioil.r2@roundtwosolutions.com.devapex';
    var password = 'sfdc@r22020';

    conn.login(username, password, function (err, userInfo) {

        if (err) {return console.error(err);}
        console.log("accessToken: "+ conn.accessToken);
        console.log("instanceUrl: "+ conn.instanceUrl);
        console.log("User ID: " + userInfo.id);
        console.log("Org ID: " + userInfo.organizationId);

        //Perform SOQL Here 
        var records = [];
        conn.query("SELECT Id, Name,CreatedBy.Name FROM PTW_Inspection_Report__c LIMIT 8100", function(err, result) { 

            //in the event that (blunder) { return console.error(err); } 
            if (err) {return console.error(err);}
            
            console.log('FirstQuery---------');
            console.log("total : " + result.totalSize); 
            console.log("fetched : " + result.records.length); 
            console.log("records : " + result.done);
            console.log("next records URL : " + result.nextRecordsUrl);

            // let baseNextUrl = result.nextRecordsUrl.split('-')[0];
            // let nextUrls = [];
            // for(let i = 1; i < result.totalSize / 2000; i++){
            //     nextUrls.push(`${baseNextUrl}-${i*2000}`);
            //     console.log('nextUrls: ',nextUrls);
            //     console.log("total : " + result.totalSize); 
            //     console.log("fetched : " + result.records.length); 
            //     console.log("records : " + result.done);
            
                conn.queryMore(result.nextRecordsUrl+'',{batchSize :2000},(err,result) => {
                    if (err) {return console.error(err);}

                    console.log('queryMore---------');
                    console.log("fetched : " + result.records.length); 
                    console.log("records : " + result.done);
                    console.log("next records URL : " + result.nextRecordsUrl);
                    if(result.done != true){
                        conn.queryMore(result.nextRecordsUrl+'',{batchSize :2000},(err,result) => {
                            console.log('queryMore 2---------');
                            console.log("fetched : " + result.records.length); 
                            console.log("records : " + result.done);
                            console.log("next records URL : " + result.nextRecordsUrl);
                        }) ; 
                    }
                    res.send(str+"> total : " + response.totalSize+"- fetched : " + response.records.length+"- nextUrls :"+nextUrls);
    
                }) ; 
            // }

        });

        
        // let response = query('SELECT Id, Name,CreatedBy.Name FROM PTW_Inspection_Report__c LIMIT 2005');
        // let baseNextUrl = response.nextRecordsUrl.split('-')[0];
        // let nextUrls = [];
        // for(let i = 1; i < response.totalSize / 2000; i++){
        // nextUrls.push(`${baseNextUrl}-${i*2000}`);
        // }
        // res.send(str+"> total : " + response.totalSize+"- fetched : " + response.records.length+"- nextUrls :"+nextUrls);
             
        
        res.send(str+" done");
    })
});*/

//POST
app.post('/createrecord', (req, res) => {
    
    var conn = new jsforce.Connection({
        // you can change loginUrl to connect to sandbox or prerelease env.
        loginUrl: 'https://test.salesforce.com'
    });
    var username = 'sfdc-thaioil.r2@roundtwosolutions.com.devapex';
    var password = 'sfdc@r22020';

    conn.login(username, password, function (err, resp) {
    
        console.log(req.body);
        const data=req.body;
        if(JSON.stringify(data) != '{}'){
            //if(!err && resp.records) {
                console.log("AccessToken: "+ conn.accessToken);
                console.log("InstanceUrl: "+ conn.instanceUrl);

                conn.sobject("Account").create(req.body,
                function(err, rets) {
                    if (err) { return console.error(err); }
                    for (var i=0; i < rets.length; i++) {
                      if (rets[i].success) {
                        console.log("Created Successfully : " + rets[i].id);
                        res.send("Created Successfully "+ rets[i].id);
                      }
                    }
                });
            //}
        }
        else{
            res.send('No data Received');
        }
    })
});

app.post('/updaterecord', (req, res) => {
    
    var conn = new jsforce.Connection({
        // you can change loginUrl to connect to sandbox or prerelease env.
        loginUrl: 'https://test.salesforce.com'
    });
    var username = 'sfdc-thaioil.r2@roundtwosolutions.com.devapex';
    var password = 'sfdc@r22020';

    console.log(req.body);
    const data=req.body;
    conn.login(username, password, function (err, resp) {
    
        if(JSON.stringify(data) != '{}'/*!err && resp.records*/) {
    
            console.log("AccessToken: "+ conn.accessToken);
            console.log("InstanceUrl: "+ conn.instanceUrl);

            // var acc = resp.records[0];
            // acc.set('Name', 'Really Spiffy Cleaners');
            // acc.set('Industry', 'Cleaners');

            conn.sobject("Account").update(req.body,

              function(err, rets) {
                if (err) { return console.error(err); }
                for (var i=0; i < rets.length; i++) {
                  if (rets[i].success) {
                    console.log("Updated Successfully : " + rets[i].id);
                    res.send("Updated Successfully");
                  }
                }
              });
        }
        else{
            res.send('No data Received');
        }
    })
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


