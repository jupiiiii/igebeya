// Initialize the Telegram WebApp instance
const tg = window.Telegram.WebApp;
const chatId = tg.initDataUnsafe.user.id;

document.addEventListener("DOMContentLoaded", function () {
    // Ensure that tg is initialized before the event listeners
    if (!tg) {
        console.error("Telegram WebApp is not initialized.");
        return;
    }

    // Toggle password type on eye click
    const togglePassword = document.querySelector("#toggle-password");
    const passwordInput = document.querySelector("#password");

    togglePassword.addEventListener("click", function () {
        // Toggle the type attribute between 'password' and 'text'
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);

        // Toggle the eye icon
        this.classList.toggle("fa-eye");
        this.classList.toggle("fa-eye-slash");

        // Toggle the visible class to apply specific CSS
        if (type === "text") {
            passwordInput.classList.add("visible");
        } else {
            passwordInput.classList.remove("visible");
        }
    });

    // Handle signup form submission
    const signupForm = document.getElementById("signup_form");

    signupForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        // Collect form data
        const username = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value.trim();
        const loadingIndicator = document.getElementById("loading");
        const submitButt = document.getElementById("submit");

        // Hash the password using SHA-256
        const hashedPassword = CryptoJS.SHA256(password).toString();

        if (!username || !email || !password) {
            alert("Please fill in all fields.");
            return;
        }


        // Prepare formData object
        const formData = {
            chatId: chatId,
            username: username,
            email: email,
            password: hashedPassword
        };

        // Change the button to loading...
        submitButt.style.display = "none";
        loadingIndicator.style.display = "block";

        // console.log("Sending Signup Data: ", formData);

        fetch('https://igebeya3-272f297966dc.herokuapp.com/user_signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                loadingIndicator.style.display = "none";
                submitButt.style.display = "block";
                alert(data.error);
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