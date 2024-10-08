// Initialize the Telegram WebApp instance
const tg = window.Telegram.WebApp;
const chatId = tg.initDataUnsafe.user.id;


document.addEventListener("DOMContentLoaded", function () {
    // Ensure that tg is initialized before the event listeners
    if (!tg) {
        console.error("Telegram WebApp is not initialized.");
        return;
    }

    const resetPassword = document.getElementById("password-reset");
    const reset = document.getElementById("reset-submit");
    const loadingIndicator = document.getElementById("loading");


    document.getElementById('reset_form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        // Change the button to loading...
        reset.style.display = "none";
        loadingIndicator.style.display = "block";

        fetch('https://igebeya3-272f297966dc.herokuapp.com/reset_password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email, chatId: chatId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("A reset code has been sent to your email.");
                window.location.href = "/newPassword.html";
            } else {
                alert("Email not found.");
                reset.style.display = "block";
                loadingIndicator.style.display = "none";
            }
        })
        .catch(error => console.error('Error:', error));
    });

});
