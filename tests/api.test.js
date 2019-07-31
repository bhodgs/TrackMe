const dotenv = require('dotenv');
const axios = require('axios');
dotenv.config();
const { API_URL } = process.env;

test('test device array', () => {
    expect.assertions(2);
    return axios.get(`${API_URL}/devices`)
    .then(resp => resp.data)
    .then(resp => {
    console.log(resp[0]);
    console.log(resp[1]);
    expect(resp[0].user).toEqual('sam')
    expect(resp[1].user).toEqual('mary123');
    });
});

test('test user array', () => {
    expect.assertions(2);
    return axios.get(`${API_URL}/users`)
    .then(resp => resp.data)
    .then(resp => {
    console.log(resp[0]);
    console.log(resp[1]);
    expect(resp[0].name).toEqual('Henry');
    expect(resp[1].name).toEqual('Ben');
    });
});

test('test user-device array', () => {
    expect.assertions(2);
    return axios.get(`${API_URL}/users/bob/devices`)
    .then(resp => resp.data)
    .then(resp => {
    console.log(resp[0]);
    expect(resp[0].name).toEqual("Bob's Samsung Galaxy");
    expect(resp[0].id).toEqual("4")
    });
});

test('test device history', () => {
    expect.assertions(1);
    return axios.get(`${API_URL}/devices/5d2bf3037f9fc9871a02183f/device-history`)
    .then(resp => resp.data)
    .then(resp => {
    console.log(resp[0]);
    expect(resp[0].temp).toEqual(14);
    });
});


