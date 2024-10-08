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
    const loginForm = document.getElementById("login_form");
    const resetPassword = document.getElementById("password-reset");

    resetPassword.addEventListener("click", function(){

    });

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent default form submission

        // Collect form data
        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value.trim();
        const loadingIndicator = document.getElementById("loading");
        const submitButt = document.getElementById("submit");

        if (!email || !password) {
            alert("Please enter an email and password.");
            return;
        }

        // Change the button to loading...
        resetPassword.style.display = "none";
        submitButt.style.display = "none";
        loadingIndicator.style.display = "block";

        // Hash the password using SHA-256
        const hashedPassword = CryptoJS.SHA256(password).toString();

        // Prepare formData object
        const formData = {
            chatId: chatId,
            email: email,
            password: hashedPassword,
            action: "login"
        };

        fetch(`https://igebeya3-272f297966dc.herokuapp.com/user_login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json()) // Parse the response as JSON
        .then(data => {
            if (data.status != "success") {
                alert(data.message);
                loadingIndicator.style.display = "none";
                submitButt.style.display = "block";
                resetPassword.style.display = "block";

            } else if (data.status === "success") {
                alert(data.message);
                window.location.href = "/shop.html";

            }
            
        })
        .catch((error) => {
            loadingIndicator.style.display = "none";
            submitButt.style.display = "block";
            console.error('Error:', error);
        });
        
    });

});