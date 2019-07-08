const devices = JSON.parse(localStorage.getItem('devices')) || [];
const users = JSON.parse(localStorage.getItem('users')) || [];

$('#navbar').load('navbar.html')
$('#footer').load('footer.html')


devices.forEach(function(device) {
    $('#devices tbody').append(`
    <tr>
    <td>${device.user}</td>
    <td>${device.name}</td>
    </tr>`
    );
   });

$('#add-device').on('click', function() {
    const user = $('#user').val();
    const name = $('#name').val();
    devices.push({ user, name });
    localStorage.setItem('devices', JSON.stringify(devices));
    location.href = '/'
});

$('#send-command').on('click', function() {
       const command = $('#command').val();
});

$('#add-user').on('click', function() {
    const username = $('#username').val()
    const password = $('#password').val()
    const confirmpassword = $('#confirmpassword').val()

    const exists = users.find(user => user.name === username);
    if(exists == undefined){
        users.push({ username, password, confirmpassword })
        localStorage.setItem('users', JSON.stringify(users));
        location.href = '/login.html'
    }
    else{
        /* Tell user */
    }

    

});