// Initialize the Telegram WebApp instance
const tg = window.Telegram.WebApp;
const chatId = tg.initDataUnsafe.user.id;

document.getElementById('confirm_reset_form').addEventListener('submit', function(e) {
    e.preventDefault();

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
            alert(data.message);
        }
    })
    .catch(error => console.error('Error:', error));
});