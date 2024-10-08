document.getElementById('confirm_reset_form').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = {
        email: document.getElementById('email').value,
        reset_token: document.getElementById('reset_token').value,
        new_password: document.getElementById('new_password').value
    };

    fetch('https://yourbackendurl/confirm_reset', {
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