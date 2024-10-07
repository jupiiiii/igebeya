// Retrieve user data from Telegram WebApp
const user = window.Telegram.WebApp.initDataUnsafe.user;
const tg = window.Telegram.WebApp;
const chatId = tg.initDataUnsafe.user.id;
const firstName = user.first_name;
const lastName = user.last_name || '';  // Last name is optional

function generateRandomAlphabet(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }

    return result;
}

// Example usage: Generate a random string of 5 characters
const randomString = generateRandomAlphabet(5);


document.addEventListener("DOMContentLoaded", function (){

    const logOut = document.getElementById("log-out-button");
    const deleteAccount = document.getElementById("delete-account");
    // Set user's name and profile picture
    document.getElementById('user-name').innerText = `${user.first_name} ${user.last_name || ''}`;
    const profilePicture = user.photo_url || 'bg.png'; // Fallback if no profile picture is available
    document.getElementById('profile-picture').src = `https://api.dicebear.com/9.x/bottts/svg?seed=${randomString}`;

    profile_details();

    // API fetch profile details
    function profile_details(){
        fetch(`https://igebeya3-272f297966dc.herokuapp.com/user_status?chat_id=${chatId}`)
            .then(response => response.json())
            .then(status => {
                // alert(status.info);
                // Populate user details
                document.getElementById("username").innerHTML = `<i class="fas fa-user"></i>  ${status.username}`;
                document.getElementById("email").innerHTML = `<i class="fas fa-envelope"></i>  ${status.email}`;
                document.getElementById("join-date").innerHTML = `<i class="fas fa-calendar-alt"></i> Since: ${status.date}`;

    
            })
            .catch((error) => console.error('Error:', error));
    }

    const userData = {chatId: chatId, action: "logout"};

    logOut.addEventListener('click', function(){
        fetch(`https://igebeya3-272f297966dc.herokuapp.com/user_login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => response.json()) // Parse the response as JSON
        .then(data => {
            if (data.status === "success") {
                alert("Logged Out!");
                window.location.href = "/home.html";

            } else {
                alert("Something went wrong!");
                return;
            }
            
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });


});
