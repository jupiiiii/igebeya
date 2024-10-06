// Retrieve user data from Telegram WebApp
const user = window.Telegram.WebApp.initDataUnsafe.user;
const firstName = user.first_name;
const lastName = user.last_name || '';  // Last name is optional

        
// Set user's name and profile picture
document.getElementById('user-name').innerText = `${user.first_name} ${user.last_name || ''}`;
alert(user.photo_url);
const profilePicture = user.photo_url || 'bg.png'; // Fallback if no profile picture is available
document.getElementById('profile-picture').src = profilePicture;