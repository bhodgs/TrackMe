const response = $.get('http://localhost:3001/devices')
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
    $.post('http://localhost:3001/devices', body)
    .then(response => {
      location.href = '/';
    })
    .catch(error => {
      console.error(`Error: ${error}`);
  }); });

$('#add-user').on('click', function() {
    const username = $('#username').val()
    const password = $('#password').val()
    const confirmpassword = $('#confirmpassword').val()
    const authenticated = false

    if(username=='' || password==''){
        alert('Please enter a username and password.')
    }

    if(password!=confirmpassword){
        alert('Your passwords did not match.')
    }else if(password==confirmpassword){
        if(users.find(user => user.username === username) == undefined){
            users.push({ username, password, authenticated })
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

    usernameCheck = users.find(user => user.username === username)
    authenticated = true

    if(usernameCheck == undefined){
        alert('Incorrect username')
    }else{
        users.forEach(function(user){
            if(user.password == password && user.username == username){
                user.authenticated = true
                localStorage.setItem('users', JSON.stringify(users));
                alert("Success, logged in.")
            }
            else{
                alert('Password incorrect.')
            }
        });
        
    }

})

const logout = () => {
    var currentUser = undefined
    users.forEach(function(user){
        if(user.authenticated == true){
            currentUser = user
        }
    });
    currentUser.authenticated = false
    localStorage.setItem('users', JSON.stringify(users));
    location.href = '/login'
}

