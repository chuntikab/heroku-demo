const express = require('express');
const app = express();
const bodyParser= require('body-parser');
const PORT = process.env.PORT || 3000 ;
var http = require('http'); //Adding http
var jsforce = require('jsforce'); //Adding JsForce

// Connect to a local redis intance locally, and the Heroku-provided URL in production
let REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

// Create / Connect to a named work queue
let workQueue = new Queue('work', REDIS_URL);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Sol1
app.get('/querymore', (req, res) => {
    const str="Query More - ";

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

            var objlist = [];
            for (var i = 0; i < records.length; i++) {
                var data = {
                    Id: records[i].Id,
                    Name__c: i+": call apex "
                };
                //console.log(records[i].Name);
                objlist.push(data);
                //console.log(olist);
            }

            conn.sobject('PTW_Inspection_Report__c')
                .update(objlist, { allowRecursive: true })
                .then((rets) => {
                    console.log('Update Successfully');
                    res.send('Update Successfully');
            });
        })
        .on("error", function(err) {
            console.error(err);
        })
        .run({ autoFetch : true, maxFetch : 20000 });

        // res.send(str+" done");
    });
});

// Kick off a new job by adding it to the work queue
app.post('/job', async (req, res) => {
    // This would be where you could pass arguments to the job
    // Ex: workQueue.add({ url: 'https://www.heroku.com' })
    // Docs: https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#queueadd
    let job = await workQueue.add();
    res.json({ id: job.id });
  });
  
  // Allows the client to query the state of a background job
  app.get('/job/:id', async (req, res) => {
    let id = req.params.id;
    let job = await workQueue.getJob(id);
  
    if (job === null) {
      res.status(404).end();
    } else {
      let state = await job.getState();
      let progress = job._progress;
      let reason = job.failedReason;
      res.json({ id, state, progress, reason });
    }
  });
// You can listen to global events to get notified when jobs are processed
workQueue.on('global:completed', (jobId, result) => {
    console.log(`Job completed with result ${result}`);
});


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
