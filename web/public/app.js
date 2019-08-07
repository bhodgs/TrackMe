
// API Hosted on now.sh
const API_URL = 'https://215120652-sit-209.now.sh/api';
// MQTT Hosted locally
const MQTT_URL = 'http://localhost:5001'

// Load header and footer first
$('#navbar').load('navbar.html')
$('#footer').load('footer.html')

// On-click Events                                          ###
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
    })
});

$('#add-user').on('click', function(){
    const input = $('#username').val()
    const name = input.toLowerCase()
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
    }
});

$("#send-command").on('click', () =>{ 
    const command = $('#command').val()
    const deviceId = $('#deviceId').val()
    const body = { deviceId, command }
    $.post(`${MQTT_URL}/send-command`, body);
});

$('#login').on('click', () =>{
    const input = $('#username').val();
    const name = input.toLowerCase();
    const password = $('#password').val();
    $.post(`${API_URL}/authenticate`, { name, password }).then((response) =>{
    if (response.success) {
        localStorage.setItem('isAuthenticated', true)
        localStorage.setItem('user', name.toLowerCase());
        location.href = '/';
    }else{$('#message').append(`<p class="alert alert-danger">${response}</p>`);}
    })
});
//                                                                                              ##

// Set local-storage for logout
const logout = () => {
    localStorage.setItem('isAuthenticated', false)
    localStorage.removeItem('user')
    // Redirect to login page
    location.href = '/login'
}


// Identify current user
const currentUser = localStorage.getItem('user');
    // If currentUser not NULL
    if (currentUser) {
        // Append our individual users details to our tbody.
        $.get(`${API_URL}/users/${currentUser}/devices`).then(response => {
        response.forEach((device) => {
        $('#devices tbody').append(`
        <tr data-device-id=${device._id}>
        <td>${device.user}</td>
        <td>${device.name}</td></tr>`
        );
        });
        // Case: User clicks on our tbody.
        // Apends our history content and shows our modal.
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
        // Forces registration or login if there are no user details in local storage.
        const path = window.location.pathname;
        if (path !== '/login' && path != '/registration') {
          location.href = '/login';
        }
      }



