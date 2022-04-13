// Require Express.js
const coin = require("./modules/coin.js");
const express = require('express');
const app = express();
var argv = require('minimist')(process.argv.slice(2));
console.log(argv);
console.log(argv.help);

// Start an app server
let portNumber = argv.port ? parseInt(argv.port) : 5000;
const server = app.listen(portNumber, () => {
    console.log('App listening on port %PORT%'.replace('%PORT%',portNumber))
});

//One flip
app.get('/app/flip/', (req, res) => {
    const result = {"flip" : coin.coinFlip()};
    res.statusCode = 200;
    res.statusMessage = 'OK';
    res.set({"Content-Type": "text/json"});
    res.json(result);
});

//Multiple flips
app.get('/app/flips/:number', (req, res) => {
    const numberOfFlips = parseInt(req.params.number);
    const raw = coin.coinFlips(numberOfFlips);
    const summary = coin.countFlips(raw);
    const result = {"raw" : raw, "summary" : summary};
    res.statusCode = 200;
    res.statusMessage = 'OK';
    res.set({"Content-Type": "text/json"});
    res.json(result);
});

//Call and flip
app.get('/app/flip/call/:call', (req, res) => {
    const call = req.params.call;
    const result = coin.flipACoin(call);
    res.statusCode = 200;
    res.statusMessage = 'OK';
    res.set({"Content-Type": "text/json"});
    res.json(result);
});

app.get('/app/', (req, res) => {
    // Respond with status 200
        res.statusCode = 200;
    // Respond with status message "OK"
        res.statusMessage = 'OK';
        res.writeHead( res.statusCode, { 'Content-Type' : 'text/plain' });
        res.end(res.statusCode+ ' ' +res.statusMessage)
});

// Default response for any other request
app.use(function(req, res){
    res.status(404).send('404 NOT FOUND')
});