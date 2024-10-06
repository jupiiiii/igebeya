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

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent default form submission

        // Collect form data
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const loadingIndicator = document.getElementById("loading");
        const submitButt = document.getElementById("submit");

        if (!email || !password) {
            alert("Please enter an email and password.");
            return;
        }

        // Hash the password using SHA-256
        const hashedPassword = CryptoJS.SHA256(password).toString();

        // Prepare formData object
        const formData = {
            chatId: chatId,
            email: email,
            password: hashedPassword
        };

        fetch('https://igebeya3-272f297966dc.herokuapp.com/save_session_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            formData: JSON.stringify(data)
        })
        .then(response => {
            alert(response.message);
            window.location.href = "/shop.html";
        })
        
        .catch((error) => console.error('Error:', error));
    });

});