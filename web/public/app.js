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

   users.forEach(function(user) {
    $('#devices tbody').append(`
    <tr>
    <td>${user.username}</td>
    <td>${user.password}</td>
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

$('#add-user').on('click', function() {
    const username = $('#username').val()
    const password = $('#password').val()
    const confirmpassword = $('#confirmpassword').val()

    if(username=='' || password==''){
        alert('Please enter a username and password.')
    }

    if(password!=confirmpassword){
        alert('Your passwords did not match.')
    }else if(password==confirmpassword){
        if(users.find(user => user.username === username) == undefined){
            users.push({ username, password })
            localStorage.setItem('users', JSON.stringify(users));
            location.href = '/login'
        }else{
            alert('Username has been taken.');
        }
    }  
});

$('#Login').on('click', function() {
    const username = $('#username').val()
    const password = $('#password').val()

    if(users.find(user => user.username === username) == undefined){
        alert('Incorrect username')
    }else{
        if(users.find(user => user.password === password) != undefined){
            /* login */
            user.isAuthenticated = true
        }
        else{
            alert('Incorrect password')
        }
    }

})

