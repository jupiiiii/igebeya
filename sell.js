document.addEventListener("DOMContentLoaded", function () {
    let tg = window.Telegram.WebApp;
    const sell_cont = document.getElementById('sell_cont')
    const myListedItemsContainer = document.getElementById('my-listed-items');

    document.getElementById('list-new-item').addEventListener('click', function () {
        document.getElementById('new-item-form').style.display = 'block';
        document.getElementById('listed-items').style.display = 'none';
    });

    document.getElementById('check-listed-items').addEventListener('click', function () {
        document.getElementById('new-item-form').style.display = 'none';
        document.getElementById('listed-items').style.display = 'block';
        fetchListedItems();
    });

    const sellForm = document.getElementById("sell-form");

    sellForm.addEventListener("submit", function (event) {
        event.preventDefault();
    
        const submitButton = document.getElementById("submit-btn");
        const loadingIndicator = document.getElementById("loading");
    
        // Disable the submit button and show the loading indicator
        submitButton.disabled = true;
        loadingIndicator.style.display = "block";
    
        const formData = new FormData(sellForm);
    
        // Validate that at least one image is selected
        const itemImages = document.getElementById("item-images").files;
        if (itemImages.length === 0) {
            alert("Please attach at least one image.");
            submitButton.disabled = false;
            loadingIndicator.style.display = "none";
            return;
        }
    
        // Get only the first five images if more than five are attached
        let imageFiles = Array.from(itemImages);
        if (imageFiles.length > 5) {
            imageFiles = imageFiles.slice(0, 5);
        }
    
        // Append images to FormData
        imageFiles.forEach(file => formData.append('images', file));
    
        // Retrieve the chat id and append
        const chatId = localStorage.getItem('chatId');
        if (chatId) {
            formData.append('chat_id', chatId);
        }
    
        // Send data to backend
        fetch('https://igebeya-bc68de5021c8.herokuapp.com/list_item', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(`Error: ${data.error}`);
            } else {
                alert(data.message);
                sellForm.reset();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to list the item. Please try again.');
        })
        .finally(() => {
            // Re-enable the submit button and hide the loading indicator
            submitButton.disabled = false;
            loadingIndicator.style.display = "none";
        });
    });
    
    // Remove focus from the input to hide the keyboard
    sell_cont.addEventListener('click', function(event) {
        // Check if the clicked element is not an input field or textarea
        if (!event.target.closest('input') && !event.target.closest('textarea')) {
            // Find all input and textarea elements
            const inputs = document.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.blur(); // Remove focus from the input to hide the keyboard
            });
        }
    });

    // Function to fetch listed items from the backend
    function fetchListedItems() {
        // Clear the existing items before fetching new ones
        myListedItemsContainer.innerHTML = '';

        // Get the chatId stored in localStorage
        const chatId = localStorage.getItem('chatId');

        // Check if chatId exists before making the API call
        if (!chatId) {
            console.error('Chat ID not found in localStorage.');
            alert('No chat id!');
            return;
        }

        // Fetch the items listed by the user
        fetch(`https://igebeya-bc68de5021c8.herokuapp.com/get_user_items?chat_id=${chatId}`)
            .then(response => response.json())
            .then(items => {
                if (items.length === 0) {
                    myListedItemsContainer.innerHTML = `<p class="no-items">No items listed yet.</p>`;
                    return;
                }

                // Populate the listed items in the DOM
                items.forEach(item => {
                    const images = item.item_pic.split(',');  // Assuming multiple images are separated by a comma
                    const itemRow = document.createElement('div');
                    itemRow.classList.add('listed-item-row');

                    // Create the HTML structure for each item row
                    itemRow.innerHTML = `
                        <div class="item-image">
                            <img src="${images[0]}" alt="${item.item_name}">
                        </div>
                        <div class="item-price">
                            <p>${item.item_name}</p>
                            <p class="list-price"><strong>ETB ${Number(item.item_price).toLocaleString()}</strong></p>
                        </div>
                        <div class="item-status">
                            <p>🟢</p>
                        </div>
                        <div class="item-unlist">
                            <button class="unlist-button" data-id="${item.id}">Unlist</button>
                        </div>
                    `;

                    // Add the item row to the container
                    myListedItemsContainer.appendChild(itemRow);
                });

                // Add event listeners for the "Unlist" buttons
                document.querySelectorAll('.unlist-button').forEach(button => {
                    button.addEventListener('click', function () {
                        const itemId = this.getAttribute('data-id');
                        unlistItem(itemId);  // Unlist the item by calling the backend
                    });
                });
            })
            .catch(error => {
                console.error('Error fetching listed items:', error);
                myListedItemsContainer.innerHTML = `<p>Failed to fetch listed items.</p>`;
            });
    }

    // Function to unlist an item
    function unlistItem(itemId) {
        // Make a request to the backend to unlist the item
        fetch(`https://igebeya-bc68de5021c8.herokuapp.com/unlist_item?id=${itemId}`, {
            method: 'POST',
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Item successfully unlisted.');
                fetchListedItems();  // Refresh the listed items
            } else {
                alert('Failed to unlist item.');
            }
        })
        .catch(error => {
            console.error('Error unlisting item:', error);
            alert('An error occurred while trying to unlist the item.');
        });
    }
});
