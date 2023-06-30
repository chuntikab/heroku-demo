/**
 * Bulk#load(sobjectType, operation, input)
 * Doc Url : https://jsforce.github.io/document/#load-from-records
 */

const express = require('express');
const app = express();
const bodyParser= require('body-parser');
const PORT = process.env.PORT || 3000 ;
var http = require('http'); //Adding http
var jsforce = require('jsforce'); //Adding JsForce
let Queue = require('bull');
 
//Solution 2
app.get('/bulkload_v2', (req, res) => {
    const str="Query More - ";

    var conn = new jsforce.Connection({
        // you can change loginUrl to connect to sandbox or prerelease env.
        loginUrl: 'https://login.salesforce.com'
    });
    var username = 'chuntika.bum@resilient-goat-reze1m.com';
    var password = 'TrailHead1007ScMCLFfUPVaYKOTrXoih755C2';

    conn.login(username, password, function (err, userInfo) {

        if (err) {return console.error(err);}
        console.log("accessToken: "+ conn.accessToken);
        console.log("instanceUrl: "+ conn.instanceUrl);
        console.log("User ID: " + userInfo.id);
        console.log("Org ID: " + userInfo.organizationId);

            // Provide records
            var ptws = [];
            for (var i = 0; i < 10000 ; i++) {
                var data = {
                    Name__c: i+'-r2'
                };
                //console.log(records[i].Name);
                ptws.push(data);
                //console.log(olist);
            }
            conn.bulk.pollTimeout = 25000; // Bulk timeout can be specified globally on the connection object
            conn.bulk.load("Account", "insert", accounts, function(err, rets) {
              if (err) { return console.error(err); }
              for (var i=0; i < rets.length; i++) {
                if (rets[i].success) {
                  console.log("#" + (i+1) + " loaded successfully, id = " + rets[i].id);
                } else {
                  console.log("#" + (i+1) + " error occurred, message = " + rets[i].errors.join(', '));
                }
              }
              // ...
            });

            res.send("done");

    });
});

//Solution 1
app.get('/bulkload_v1', (req, res) => {
    const str="Query More - ";

    var conn = new jsforce.Connection({
        // you can change loginUrl to connect to sandbox or prerelease env.
        loginUrl: 'https://login.salesforce.com'
    });
    var username = 'chuntika.bum@resilient-goat-reze1m.com';
    var password = 'TrailHead1007ScMCLFfUPVaYKOTrXoih755C2';

    conn.login(username, password, function (err, userInfo) {

        if (err) {return console.error(err);}
        console.log("accessToken: "+ conn.accessToken);
        console.log("instanceUrl: "+ conn.instanceUrl);
        console.log("User ID: " + userInfo.id);
        console.log("Org ID: " + userInfo.organizationId);

            // Provide records
            /*var accounts = [
                { Name : 'Account #21' },
                { Name : 'Account #22' },
                { Name : 'Account #23' },
            ];*/
            var ptws = [];
            for (var i = 0; i < 10000 ; i++) {
                var data = {
                    Name__c: i+'-r2'
                };
                //console.log(records[i].Name);
                ptws.push(data);
                //console.log(olist);
            }
            // Create job and batch
            var job = conn.bulk.createJob("PTW_Inspection_Report__c", "insert");
            var batch = job.createBatch();
            // start job
            batch.execute(ptws);
            // listen for events
            batch.on("error", function(batchInfo) { // fired when batch request is queued in server.
                console.log('Error, batchInfo:', batchInfo);
            });
            batch.on("queue", function(batchInfo) { // fired when batch request is queued in server.
                console.log('queue, batchInfo:', batchInfo);
                batch.poll(1000 /* interval(ms) */, 20000 /* timeout(ms) */); // start polling - Do not poll until the batch has started
            });
            batch.on("response", function(rets) { // fired when batch finished and result retrieved
                for (var i=0; i < rets.length; i++) {
                if (rets[i].success) {
                    console.log("#" + (i+1) + " loaded successfully, id = " + 
                    rets[i].id);
                } else {
                    console.log("#" + (i+1) + " error occurred, message = " + 
                    rets[i].errors.join(', '));
                }
                }
                // ...
            });
            res.send("done");

    });
});

app.listen(PORT, () => {
    console.log(`Listening on ${ PORT }`);
});
