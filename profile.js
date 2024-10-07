// Retrieve user data from Telegram WebApp
const user = window.Telegram.WebApp.initDataUnsafe.user;
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
    // Set user's name and profile picture
    document.getElementById('user-name').innerText = `${user.first_name} ${user.last_name || ''}`;
    const profilePicture = user.photo_url || 'bg.png'; // Fallback if no profile picture is available
    document.getElementById('profile-picture').src = `https://api.dicebear.com/9.x/bottts/svg?seed=${randomString}`;

    // API fetch profile details
    function profile_details(){
        fetch(`https://igebeya3-272f297966dc.herokuapp.com/user_status?chat_id=${chatId}`)
            .then(response => response.json())
            .then(status => {
                // alert(status.info);

                // Check the user status and forward accordingly
                if (status.info === "Logged_in") {
                    window.location.href = "/shop.html";
                } else if (status.info === "Logged_out") {
                    window.location.href = "/login.html";
                } else if (status.info === "New_user"){
                    window.location.href = "/signup.html";
                }
            })
            .catch((error) => console.error('Error:', error));
    }


});
