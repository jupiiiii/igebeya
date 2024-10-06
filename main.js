// Initialize the Telegram WebApp instance
const tg = window.Telegram.WebApp;
const chatId = tg.initDataUnsafe.user.id;


start();

function start(){
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

// document.addEventListener("DOMContentLoaded", function () {
//     // Ensure that tg is initialized before the event listeners
//     if (!tg) {
//         console.error("Telegram WebApp is not initialized.");
//         return;
//     }

//     // Handle signup form submission
//     const signupForm = document.getElementById("signup_form");
//     const loginForm = document.getElementById("login_form");

//     if(signupForm){
//         signupForm.addEventListener("submit", function (event) {
//             event.preventDefault(); // Prevent default form submission

//             // Collect form data
//             const username = document.getElementById("username").value.trim();
//             const email = document.getElementById("email").value.trim();
//             const password = document.getElementById("password").value.trim();

//             // Hash the password using SHA-256
//             const hashedPassword = CryptoJS.SHA256(password).toString();

//             if (!username || !email || !password) {
//                 alert("Please fill in all fields.");
//                 return;
//             }

//             // Create an object to hold the data
//             const formData = {
//                 signup: 'signup',
//                 username: username,
//                 email: email,
//                 password: hashedPassword
//             };

//             console.log("Sending Signup Data: ", formData);

//             // Send the data to Telegram
//             tg.sendData(JSON.stringify(formData));

//             // Optionally, you can close the WebApp after sending the data
//             tg.close();
//         });
//     }

//     if (loginForm){
//         loginForm.addEventListener("submit", function (e) {
//             e.preventDefault(); // Prevent default form submission

//             // Collect form data
//             const email = document.getElementById("email").value.trim();
//             const password = document.getElementById("password").value.trim();

//             // Hash the password using SHA-256
//             const hashedPassword = CryptoJS.SHA256(password).toString();

//             if (!email || !password) {
//                 alert("Please enter an email and password.");
//                 return;
//             }

//             // Prepare formData object
//             const formData = {
//                 login: 'login',
//                 email: email,
//                 password: hashedPassword
//             };

//             console.log("Sending Login Data: ", formData);

//             // Send the data to Telegram
//             tg.sendData(JSON.stringify(formData));

//             // Optionally, close the WebApp after sending the data
//             tg.close();
//         });
//     }
// });
