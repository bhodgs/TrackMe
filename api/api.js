const Device = require('./models/device');
const User = require('./models/user');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
var bodyParser = require('body-parser');
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/api/test', (req, res) => {
  res.send('The API is working!');
});
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
app.get('/api/devices', (req, res) => {
  Device.find({}, (err, devices) => {
    return err
      ? res.send(err)
      : res.send(devices);
}); });

app.post('/api/send-command', (req, res) => {
  console.log(req.body.command);
});

app.post('/api/devices', (req, res) => {
  const { name, user, sensorData } = req.body;
  const newDevice = new Device({
    name,
    user,
    sensorData
  });
  newDevice.save(err => {
    return err
      ? res.send(err)
      : res.send('successfully added device and data');
}); });

app.post('/api/authenticate', (req, res) => {
  const {name, password} = req.body;
  userCheck = User.findOne({name}).then(doc => {
    if(!doc){ return res.send('User not found.')}
    else if(doc.password == password) 
    { 
      return res.json({
        success: true,
        message: 'Authenticated successfully',
        isAdmin: doc.isAdmin
     });
    }
    else{
      return res.send('Password incorrect.');
    }
  }).catch(err =>{
    return err
  });
});

app.post('/api/register', (req, res) =>{
  const {name, password, isAdmin} = req.body;
  User.findOne({name}).then(doc => {
    if(doc){return res.send('Username taken.')}
    else{
      const newUser = new User({
        name: name,
        password,
        isAdmin
       });
       newUser.save(err => {
        return err
        ? res.send(err)
        : res.json({
        success: true,
        message: 'Created new user'
        });
       });
    }
  }).catch(err => {
    return err;
  })
})

app.get('/api/users', (req, res) => {
  User.find({}, (err, users) => {
    return err
      ? res.send(err)
      : res.send(users);
}); });

app.get('/api/devices/:deviceId/device-history', (req, res) => {
  const { deviceId } = req.params;
  Device.findOne({"_id": deviceId }, (err, devices) => {
  const { sensorData } = devices;
    return err
      ? res.send(err)
      : res.send(sensorData);
  });
 });

 app.get('/api/users/:user/devices', (req, res) => {
  const { user } = req.params;
  Device.find({ "user": user }, (err, devices) => {
    return err
      ? res.send(err)
      : res.send(devices);
  });
 });
