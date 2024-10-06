// Initialize the Telegram WebApp instance
const tg = window.Telegram.WebApp;
const chatId = tg.initDataUnsafe.user.id;


document.addEventListener("DOMContentLoaded", function () {
    // Ensure that tg is initialized before the event listeners
    if (!tg) {
        console.error("Telegram WebApp is not initialized.");
        return;
    }

    // Handle signup form submission
    const loginForm = document.getElementById("login_form");

    if (loginForm){
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault(); // Prevent default form submission

            // Collect form data
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            // Hash the password using SHA-256
            const hashedPassword = CryptoJS.SHA256(password).toString();

            if (!email || !password) {
                alert("Please enter an email and password.");
                return;
            }

            // Prepare formData object
            const formData = {
                login: 'login',
                email: email,
                password: hashedPassword
            };

            console.log("Sending Login Data: ", formData);

            // Send the data to Telegram
            tg.sendData(JSON.stringify(formData));

            // Optionally, close the WebApp after sending the data
            tg.close();
        });
    }
});