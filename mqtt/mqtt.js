const mqtt = require('mqtt');
const mongoose = require('mongoose');
const Device = require('./models/device');
const express = require('express');
const bodyParser = require('body-parser');
const rand = require('random-int');
const randomCoordinates = require('random-coordinates');
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

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });
/**
 * @api {get} Checks connection to mqtt
 * @apiGroup Connect
 *
 * @apiSuccess {String} Connected
 * @apiError {String} Error message.
 */
client.on('connect', () => {
    client.subscribe('/sensorData');
    console.log('connected');
});
/**
 * @api {get} Obtains message dependant on topic
 * @apiGroup Device
 * @apiParam {JSON} DeviceID to findOne
 * @apiSuccess {JSON} Data received
 * @apiError {String} Error message.
 */
client.on('message', (topic, message) => {
  if (topic == '/sensorData') {
  const data = JSON.parse(message);
  console.log(data);
 
  Device.findOne({"name": data.deviceId }, (err, device) => {
   if (err) {console.log(err)}
   const { sensorData } = device;
   const { ts, loc, temp } = data;
   sensorData.push({ ts, loc, temp });
   device.sensorData = sensorData;
   device.save(err => {
   if (err) {console.log(err)}
  });
  });
}
});

/**
 * @api {POST} Posts command to specific device
 * @apiGroup Command
 * @apiParam {JSON} Array of deviceID and command.
 * @apiSuccess {String} Device and command received.
 * @apiError {String} Error message.
 */
app.post('/send-command', (req, res) => {
    const { deviceId, command }  = req.body;
    const topic = `/command/${deviceId}`;
    client.publish(topic, command, () => {
      res.send('published new message');
    });
    console.log(deviceId, command);
  });


/**
 * @api {PUT} Puts new sonsor data to MONGO db
 * @apiGroup Device
 * @apiParam {JSON} Array of deviceId, ts, loc and temp.
 * @apiSuccess {String} Published new message
 * @apiError {String} Error message.
 */
app.put('/sensor-data', (req, res) => {
  const { deviceId } = req.body;
  const [lat, lon] = randomCoordinates().split(", ");
  const ts = new Date().getTime();
  const loc = { lat, lon };
  const temp = rand(20, 50);
  const topic = `/sensorData`;
  const message = JSON.stringify({ deviceId, ts, loc, temp });
  client.publish(topic, message, () => {
  res.send('published new message');
    });
   });

const port = 5001;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });