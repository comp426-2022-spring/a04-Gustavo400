// Require Express.js
const coin = require("./modules/coin.js");
const database = require("./modules/database");
const express = require('express');
const app = express();
var argv = require('minimist')(process.argv.slice(2));
const morgan = require("morgan");
const fs = require("fs");

//help documentation
const help = 
(`server.js [options]

--port       Set the port number for the server to listen on. Must be an integer
            between 1 and 65535.

--debug     If set to true, creates endpoints /app/log/access/ which returns
            a JSON access log from the database and /app/error which throws 
            an error with the message "Error test successful." Defaults to 
            false.

--log       If set to false, no log files are written. Defaults to true.
            Logs are always written to database.

--help      Return this message and exit.`);

// Check for --help or --h parameters
if (argv.help || argv.h) {
    console.log(help);
    process.exit(0);
}

// Start an app server
let portNumber = argv.port ? parseInt(argv.port) : 5000;
const server = app.listen(portNumber, () => {
    console.log('App listening on port %PORT%'.replace('%PORT%',portNumber))
    database.initDatabase();
    console.log("Created database");
});

// Logging to file if "--log=true"
if(argv.log !== "false") {
    console.log("LOGGING = TRUE")
    const accesslog = fs.createWriteStream('access.log', { flags: 'a'});
    app.use(morgan("combined", { stream: accesslog }));

} else{
    console.log("LOGGING = FALSE");
}

// Debug endpoints only if debug flag is true
if(argv.debug === "true" || argv.debug === true || argv.deeznuts) {
    console.log("DEBUGGING = TRUE");
    // /app/error test endpoint
    app.get('/app/error/', (req,res) => {
        database.insertRow(fondle(req, res));
        throw new Error('Error test successful')
    });

    app.get('/app/log/access/', (req,res) => {
        const result = database.getAll();
        res.statusCode = 200;
        res.statusMessage = 'OK';
        res.set({"Content-Type": "text/json"});
        res.json(result);
        database.insertRow(fondle(req, res));
    });
} else {
    console.log("DEBUGGING = FALSE");
}



// Grab info to add to database
function fondle(req, res) {
    const logdata = {
        "remoteaddr": req.ip,
        "remoteuser": req.user,
        "time": Date.now(),
        "method": req.method,
        "url": req.url,
        "protocol": req.protocol,
        "httpversion": req.httpVersion,
        "status": res.statusCode,
        "referer": req.headers['referer'],
        "useragent": req.headers['user-agent']
    }

    return logdata;
}

app.get('/app/', (req, res) => {
    // Respond with status 200
        res.statusCode = 200;
    // Respond with status message "OK"
        res.statusMessage = 'OK';
        res.writeHead( res.statusCode, { 'Content-Type' : 'text/plain' });
        res.end(res.statusCode+ ' ' +res.statusMessage)

        //console.log(fondle(req, res));
        database.insertRow(fondle(req, res));
});

//One flip
app.get('/app/flip/', (req, res) => {
    const result = {"flip" : coin.coinFlip()};
    res.statusCode = 200;
    res.statusMessage = 'OK';
    res.set({"Content-Type": "text/json"});
    res.json(result);

    database.insertRow(fondle(req, res));
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

    database.insertRow(fondle(req, res));
});

//Call and flip
app.get('/app/flip/call/:call', (req, res) => {
    const call = req.params.call;
    const result = coin.flipACoin(call);
    res.statusCode = 200;
    res.statusMessage = 'OK';
    res.set({"Content-Type": "text/json"});
    res.json(result);

    database.insertRow(fondle(req, res));
});

// Default response for any other request
app.use(function(req, res){
    res.status(404).send('404 NOT FOUND')

    database.insertRow(fondle(req, res));
});