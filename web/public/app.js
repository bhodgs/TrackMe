const API_URL = 'http://localhost:5000/api';
const users = JSON.parse(localStorage.getItem('users')) || [];

$('#navbar').load('navbar.html')
$('#footer').load('footer.html')
const currentUser = localStorage.getItem('user');
    if (currentUser) {
        $.get(`${API_URL}/users/${currentUser}/devices`).then(response => {
        response.forEach((device) => {
        $('#devices tbody').append(`
        <tr data-device-id=${device._id}>
        <td>${device.user}</td>
        <td>${device.name}</td>
        </tr>`
        );
        });
        $('#devices tbody tr').on('click', (e) => {
         const deviceId = e.currentTarget.getAttribute('data-device-id');
         $.get(`${API_URL}/devices/${deviceId}/device-history`).then(response => {
            response.map(sensorData => {
                $('#historyContent').append(`
                <tr>
                <td>${sensorData.ts}</td>
                <td>${sensorData.temp}</td>
                <td>${sensorData.loc.lat}</td>
                <td>${sensorData.loc.lon}</td>
                </tr>
                `);
               });
            $('#historyModal').modal('show');
         });
        });
        }).catch(error => {
        console.error(`Error: ${error}`);
         });
    }
    else {
        const path = window.location.pathname;
        if (path !== '/login') {
            location.href = '/login';
        }
    }   
$('#add-device').on('click', function() {
    const name = $('#name').val();
    const username = $('#user').val();
    const sensorData = [];
    const body = {
      name,
      username,
      sensorData
    };
    $.post(`${API_URL}/devices`, body).then(response => {
      location.href = '/';
    }).catch(error => {
      console.error(`Error: ${error}`);
    }); 
});

$('#add-user').on('click', function(){
    const name = $('#username').val()
    const password = $('#password').val()
    const confirmpassword = $('#confirmpassword').val();
    if(username=='' || password==''){
        alert('Please enter a username and password.')
    }
    else if(password!=confirmpassword){
        alert('Your passwords did not match.')
    }
    else if(password==confirmpassword){
        $.post(`${API_URL}/register`, { name, password }).then((response) =>{
            if (response.success) {
                location.href = '/login';
            }else{
                $('#message').append(`<p class="alert alert-danger">${response}</p>`);
            }
    });
    };
});

$('#login').on('click', function(){
    console.log('login')
    const name = $('#user').val();
    const password = $('#password').val();
    $.post(`${API_URL}/authenticate`, { name, password }).then((response) =>{
    if (response.success) {
        localStorage.setItem('name', user);
        localStorage.setItem('isAdmin', response.isAdmin);
        location.href = '/';
    }else{$('#message').append(`<p class="alert alert-danger">${response}</p>`);}
    })
});

const logout = () => {
    var currentUser = undefined
    users.forEach(function(user){
        if(user.authenticated == true){
            currentUser = user
        }
    });
    currentUser.authenticated = false
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.removeItem('user', user);
    location.href = '/login'
}




    
