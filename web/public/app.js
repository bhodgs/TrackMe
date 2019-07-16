

const API_URL = 'http://localhost:5000/api';

const users = JSON.parse(localStorage.getItem('users')) || [];

$('#navbar').load('navbar.html')
$('#footer').load('footer.html')

const response = $.get(`${API_URL}/devices`)
.then(response => {
  response.forEach(device => {
    $('#devices tbody').append(`
    <tr>
    <td>${device.user}</td>
    <td>${device.name}</td>
</tr>`
); });
})
.catch(error => {
console.error(`Error: ${error}`);
});

devices.forEach(function(device) {
    $('#devices tbody').append(`
    <tr>
    <td>${device.user}</td>
    <td>${device.name}</td>
    </tr>`
    );
   });

users.forEach(function(user) {
    $('#users tbody').append(`
    <tr>
    <td>${user.username}</td>
    <td>${user.password}</td>
    <td>${user.authenticated}</td>
    </tr>`
    );
   });

   $('#add-device').on('click', () => {
    const name = $('#name').val();
    const user = $('#user').val();
    const sensorData = [];
    const body = {
      name,
      user,
      sensorData
    };
    $.post(`${API_URL}/devices`, body).then(response => {
      location.href = '/';
    })
    .catch(error => {
      console.error(`Error: ${error}`);
  }); });

$('#add-user').on('click', function() {
    const username = $('#username').val()
    const password = $('#password').val()
    const confirmpassword = $('#confirmpassword').val();
    if(username=='' || password==''){
        alert('Please enter a username and password.')
    }
    else if(password!=confirmpassword){
        alert('Your passwords did not match.')
    }else if(password==confirmpassword){
        $.post(`${API_URL}/register`, { user, password }).then((response) =>{
    if (response.success) {
        location.href = '/login';
    } else {
        $('#message').append(`<p class="alert alert-danger">${response}</p>`);
    }
    });
    };
});

$('#login').on('click', () => {
    const user = $('#user').val();
    const password = $('#password').val();
    $.post(`${API_URL}/authenticate`, { user, password }).then((response) =>{
    if (response.success) {
        localStorage.setItem('user', user);
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

