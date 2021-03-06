const express = require('express')
const app = express()
const port = process.env.PORT || 8080;
const base = `${__dirname}/public`;
app.use(express.static('public'));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.listen(port, () => {
    console.log(`listening to port: 3000`);
});
app.get('/', function (req, res) {
    console.log('Loading device list.');
    res.sendFile(`${base}/device-list.html`);
});

app.get('/send-command', (req, res) => {
    console.log('Loading send command.');
    res.sendFile(`${base}/send-command.html`);
});

app.get('/register-device', (req, res) => {
    console.log('Loading register device.');
    res.sendFile(`${base}/register-device.html`);
});

app.get('/about-me', (req, res) => {
    console.log('Loading about me.');
    res.sendFile(`${base}/about-me.html`);
});

app.get('/registration', (req, res) => {
    console.log('Loading registration.');
    res.sendFile(`${base}/registration.html`);
});

app.get('/login', (req, res) => {
    console.log('Loading login.');
    res.sendFile(`${base}/login.html`);
});

app.get('/navbar', (req, res) => {
    console.log('Loading navbar.');
    res.sendFile(`${base}/navbar.html`);
});

app.get('*', (req, res) => {
    console.log('Loading 404.');
    res.sendFile(`${base}/404.html`);
});








