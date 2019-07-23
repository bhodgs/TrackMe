const mqtt = require('mqtt');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const { URL, PORT, USERNAME, PASSWORD } = process.env;

const client = mqtt.connect({
    host: URL,
    port: PORT,
    username: USERNAME,
    password: PASSWORD
});

client.on('connect', () => {
    console.log('connected');
});

app.post('/send-command', (req, res) => {
    const { deviceId, command }  = req.body;
    const topic = `/command/${deviceId}`;
    client.publish(topic, command, () => {
      res.send('published new message');
    });
  });
const port = 5001;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });
