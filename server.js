const express = require('express');
const app = express();
const bodyParser= require('body-parser');
const PORT = process.env.PORT || 3000 ;
var http = require('http'); //Adding http
var jsforce = require('jsforce'); //Adding JsForce
let Queue = require('bull');

// Connect to a local redis intance locally, and the Heroku-provided URL in production
let REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

// Create / Connect to a named work queue
let workQueue = new Queue('work', REDIS_URL);

// Serve the two static assets
app.get('/', (req, res) => res.sendFile('index.html', { root: __dirname }));
app.get('/client.js', (req, res) => res.sendFile('client.js', { root: __dirname }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

//Sol1
app.get('/querymore', (req, res) => {
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
        var accounts = [
            { Name__c : 'Account #1' },
            { Name__c : 'Account #2' },
            { Name__c : 'Account #3' },
        ];
        // Create job and batch
        var job = conn.bulk.createJob("PTW_Inspection_Report__c", "insert");
        var batch = job.createBatch();
        // start job
        batch.execute(accounts);
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
                console.log("#" + (i+1) + " loaded successfully, id = " + rets[i].id);
            } else {
                console.log("#" + (i+1) + " error occurred, message = " + rets[i].errors.join(', '));
            }
            }
            // ...
        });
});

app.listen(PORT, () => {
    console.log(`Listening on ${ PORT }`);
});
