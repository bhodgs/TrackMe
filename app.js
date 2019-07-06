const devices = [];
devices.push({ user: "Mary", name: "Mary's iPhone" });
devices.push({ user: "Alex", name: "Alex's Surface Pro" });
devices.push({ user: "Mary", name: "Mary's MacBook" });

devices.forEach(function(device) {
    $('#devices tbody').append(`
    <tr>
    <td>${device.user}</td>
    <td>${device.name}</td>
    </tr>`
    );
   });

document.querySelector('#add-device').addEventListener('click',
function() {
 const user = document.querySelector('#user').value;
 const name = document.querySelector('#name').value;
 devices.push({ user: user, name: name });
 console.log(devices);
});