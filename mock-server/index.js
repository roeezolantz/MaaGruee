
const express = require('express')
const jsonfile = require('jsonfile');
const path = require('path');
const bodyParser = require('body-parser');

const app = express()
const port = 8080

const getStaticJSONFile = (fileName, res) => {

    var file = path.normalize(__dirname + '/' + fileName);
    console.log('path: ' + file);

    jsonfile.readFile(file, function (err, obj) {
        if (err) {
            console.log("Eror while sending..", err)
            res.json({ status: 'error', reason: err.toString() });
            return;
        }

        console.log("Sent!")

        res.json(obj);
    });
};
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/data', (req, res) => {
    var file = path.normalize(__dirname + '/data/charts.json');
    console.log('File to send :', file);

    jsonfile.readFile(file, function (err, obj) {
        if (err) {
            console.log("error while sending...", err)
            res.json({ status: 'error', reason: err.toString() });
            return;
        }

        console.log("Sent..")

        res.json(obj);
    });
});

app.put('/data', (req, res) => {
    // res.json(data)
    console.log("PUT /data with data :", req.body)
    res.sendStatus(200)
});

app.get('/tradeoffs', (req, res) => {
    var file = path.normalize(__dirname + '/data/tradeoffs.json');

    console.log("network is :", req.query.network, " and sensor is :", req.query.sensor)

    jsonfile.readFile(file, function (err, obj) {
        if (err) {
            console.log("error while sending...", err)
            res.json({ status: 'error', reason: err.toString() });
            return;
        }

        const valToSend = obj.tradeoffs.find(curr => curr.network === req.query.network && curr.sensor === req.query.sensor)

        if (!valToSend) res.json({})
        else res.json(valToSend)
    });
});

app.get('/janitorBlacklist', (req, res) => {
    var file = path.normalize(__dirname + '/data/blacklists.json');

    console.log('File to send :', file);

    jsonfile.readFile(file, function (err, obj) {
        if (err) {
            console.log("error while sending...", err)
            res.json({ status: 'error', reason: err.toString() });
            return;
        }

        console.log("Sent..")

        res.json(obj);
    });
});

app.post('/janitorBlacklist', (req, res) => {
    // res.json(data)
    console.log("POST /janitorBlacklist")
    res.sendStatus(200)
});

app.put('/janitorBlacklist', (req, res) => {
    // res.json(data)
    console.log("PUT /janitorBlacklist")
    res.sendStatus(200)
});

app.delete('/janitorBlacklist', (req, res) => {
    // res.json(data)
    console.log("DELETE /janitorBlacklist")
    res.sendStatus(200)
});

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Mock app listening on port ${port}!`))