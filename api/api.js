const Device = require('./models/device');
const User = require('./models/user');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

var bodyParser = require('body-parser');
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

app.use(express.static(`${__dirname}/public`));


mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


/**
 * @api {get} /api/test Check if the api is up
 * @apiGroup Test
 *
 * @apiSuccess {String} The api is working.
 * @apiError {null} No response.
 */
app.get('/api/test', (req, res) => {
  res.send('The API is working!');
});
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
/**
 * @api {get} /api/devices Gets all devices from mongoDB
 * @apiGroup Devices
 *
 * @apiSuccess {JSON} Array of devices and attributes.
 * @apiError {String} Error message.
 */
app.get('/api/devices', (req, res) => {
  Device.find({}, (err, devices) => {
    return err
      ? res.send(err)
      : res.send(devices);
}); });
/**
 * @api {post} /api/devices Posts new device to database.
 * @apiGroup Devices
 * @apiParam {JSON} Array of new device and properties.
 * 
 * @apiSuccess {String} Identifying success.
 * @apiError {String} Error message.
 */
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
/**
 * @api {post} /api/authenticate Authenticates user upon login.
 * @apiGroup User
 * @apiParam {JSON} Array of username and password.
 * 
 * @apiSuccess {String} Authenticated successfully.
 * @apiError {String} User not found, password incorrect, or raw error message.
 */
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

/**
 * @api {post} /api/register Adds new user to database.
 * @apiGroup User
 * @apiParam {JSON} Array of new user and properties.
 * 
 * @apiSuccess {String} Created new user.
 * @apiError {String} Username taken, or raw error message.
 */
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
/**
 * @api {get} /api/users Prints list of all users in database.
 * @apiGroup Test
 * 
 * 
 * @apiSuccess {JSON} Array of all users and their properties.
 * @apiError {HTML} Raw error.
 */
app.get('/api/users', (req, res) => {
  User.find({}, (err, users) => {
    return err
      ? res.send(err)
      : res.send(users);
}); });
/**
 * @api {get} /api/devices/:deviceId/device-history' Prints device data.
 * @apiGroup Device
 * @apiParam {String} Device ID.
 * 
 * @apiSuccess {JSON} Device sensor data.
 * @apiError {HTML} Raw error.
 */
app.get('/api/devices/:deviceId/device-history', (req, res) => {
  const { deviceId } = req.params;
  Device.findOne({"_id": deviceId }, (err, devices) => {
  const { sensorData } = devices;
    return err
      ? res.send(err)
      : res.send(sensorData);
  });
 });
/**
 * @api {get} /api/users/:user/devices Prints device data for user.
 * @apiGroup User
 * @apiParam {String} Username.
 * 
 * @apiSuccess {JSON} Device data.
 * @apiError {HTML} Raw error.
 */
 app.get('/api/users/:user/devices', (req, res) => {
  const { user } = req.params;
  Device.find({ "user": user }, (err, devices) => {
    return err
      ? res.send(err)
      : res.send(devices);
  });
 });

 app.get('/docs', (req, res) => {
  res.sendFile(`${__dirname}/public/generated-docs/index.html`);
 });
