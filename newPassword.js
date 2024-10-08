// Initialize the Telegram WebApp instance
const tg = window.Telegram.WebApp;
const chatId = tg.initDataUnsafe.user.id;


document.addEventListener("DOMContentLoaded", function(){
    // Toggle password type on eye click
    const togglePassword = document.querySelector("#toggle-password");
    const passwordInput = document.querySelector("#new_password");
    const submitButt = document.getElementById("reset-submit");
    const loadingIndicator = document.getElementById("loading");
    const goBack = document.getElementById("back-home");


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
    
    document.getElementById('confirm_reset_form').addEventListener('submit', function(e) {
        e.preventDefault();

        // Change the button to loading...
        submitButt.style.display = "none";
        goBack.style.display = "none";
        loadingIndicator.style.display = "block";
    
        const email = document.getElementById('email').value.trim();
        const reset_token = document.getElementById('reset_token').value.trim();
        const new_password = document.getElementById('new_password').value.trim();
    
    
        // Hash the password using SHA-256
        const hashedPassword = CryptoJS.SHA256(new_password).toString();
    
        const formData = {
            chatId: chatId,
            email: email,
            reset_token: reset_token,
            password: hashedPassword
        };
    
    
        fetch('https://igebeya3-272f297966dc.herokuapp.com/confirm_reset', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Password reset successful!");
                window.location.href = "/login.html";
            } else {
                // Change the button to loading...
                submitButt.style.display = "block";
                goBack.style.display = "block";
                loadingIndicator.style.display = "none";
                alert(data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    });
});