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
    const signupForm = document.getElementById("signup_form");

    signupForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        // Collect form data
        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const formData = new FormData(signupForm);
        const loadingIndicator = document.getElementById("loading");
        const submitButt = document.getElementById("submit");

        // Hash the password using SHA-256
        const hashedPassword = CryptoJS.SHA256(password).toString();

        if (!username || !email || !password) {
            alert("Please fill in all fields.");
            return;
        }

        // Create an object to hold the data
        formData.append("chatId", chatId);
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", hashedPassword);

        // Change the button to loading...
        submitButt.style.display = "none";
        loadingIndicator.style.display = "block";

        // console.log("Sending Signup Data: ", formData);

        fetch('https://igebeya3-272f297966dc.herokuapp.com/user_signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                loadingIndicator.style.display = "none";
                submitButt.style.display = "block";
                alert(`Error: ${data.error}`);
                return;
            } else {
                alert(data.message);
                window.location.href = "/login.html";
            }
        })
        .catch(error => {
            // console.error('Error:', error);
            alert('Failed to signup. Please try again!');
        })
    });

});