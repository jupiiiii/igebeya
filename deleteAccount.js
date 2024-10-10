// Get modal and button elements
const deleteModal = document.getElementById("delete-modal");
const deleteBtn = document.getElementById("delete-account-btn");
const closeModalBtn = document.querySelector(".close-btn");
const confirmDeleteBtn = document.getElementById("confirm-delete-btn");

// Open modal when delete account button is clicked
deleteBtn.addEventListener("click", () => {
    deleteModal.style.display = "block";
});

// Close the modal when the close button is clicked
closeModalBtn.addEventListener("click", () => {
    deleteModal.style.display = "none";
});

// Close modal if the user clicks outside the modal content
window.addEventListener("click", (event) => {
    if (event.target == deleteModal) {
        deleteModal.style.display = "none";
    }
});

// Handle the confirmation of account deletion
confirmDeleteBtn.addEventListener("click", () => {
    const password = document.getElementById("delete-password").value.trim();
    if (password) {
        // Send the password to the backend for verification
        fetch('https://your-backend-url.com/delete_account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password: password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                alert("Account deleted successfully");
                window.location.href = "/goodbye.html"; // Redirect after deletion
            } else {
                alert("Incorrect password, please try again.");
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        alert("Please enter your password.");
    }
});
