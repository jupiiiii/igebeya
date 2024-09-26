function updatePageHistory(pageName) {
    // Retrieve existing history from localStorage or initialize an empty array
    let pageHistory = JSON.parse(localStorage.getItem('pageHistory')) || [];
    
    // Add the current page to the history
    pageHistory.push(pageName);
    
    // Save the updated history back to localStorage
    localStorage.setItem('pageHistory', JSON.stringify(pageHistory));
}

updatePageHistory('sell.html'); // Call this with each page the user navigates to

function getPageHistory() {
    return JSON.parse(localStorage.getItem('pageHistory')) || [];
}

let pageHistory = getPageHistory();

document.addEventListener("DOMContentLoaded", function () {
    let tg = window.Telegram.WebApp;
    const sell_cont = document.getElementById('sell_cont')
    const myListedItemsContainer = document.getElementById('my-listed-items');

    // City drop down
    const cityTrigger = document.getElementById("city-dropdown-trigger");
    const cityDropdown = document.getElementById("city-list");
    const selectedCityDisplay = document.getElementById("selected-city");
    const itemCityInput = document.getElementById('item-city');

    // Main category drop down
    const mainTrigger = document.getElementById("category-dropdown-trigger");
    const mainDropdown = document.getElementById("category-list");
    const selectedMainCategoryDisplay = document.getElementById("selected-category");
    const mainCategoryInput = document.getElementById('item-category');
    const subCatForm = document.getElementById("hidden-sub-category-form");

    document.getElementById('list-new-item').addEventListener('click', function () {
        document.getElementById('new-item-form').style.display = 'block';
        document.getElementById('listed-items').style.display = 'none';
    });

    document.getElementById('check-listed-items').addEventListener('click', function () {
        document.getElementById('new-item-form').style.display = 'none';
        document.getElementById('listed-items').style.display = 'block';
        fetchListedItems();
    });

    // Show the Telegram back button in the top bar
    tg.BackButton.show();

    // Handle back button click event
    tg.onEvent('backButtonClicked', function() {
        // Go to the previous page using Telegram's built-in back button functionality
        if (pageHistory.length > 0) {
            // Navigate back by removing the last page from history
            pageHistory.pop();
            const previousPage = pageHistory.pop();

            // Manually navigate to the previous page. shop, sell, item-details
            // window.location.href = previousPage;

            // If the previous page is home.html, switch to close button
            if (previousPage === 'shop.html') {
                localStorage.removeItem('pageHistory');
                let pageHistory = [];
                pageHistory.push('shop.html')
                localStorage.setItem('pageHistory', JSON.stringify(pageHistory));
                tg.BackButton.hide();
                window.history.back();
            }
            else{
                window.history.back();  // You can use custom logic here as well
            }
        } else {
            tg.BackButton.hide();
            window.history.back();
        }

    });

    // City dropdown
    // Toggle dropdown visibility when city is clicked
    cityTrigger.addEventListener("click", function() {
        cityDropdown.classList.toggle("hidden");
    });

    // Handle city selection
    cityDropdown.addEventListener("click", function(event) {
        const selectedCity = event.target.getAttribute('data-city');
        if (selectedCity) {
            selectedCityDisplay.textContent = selectedCity; // Update the displayed city
            itemCityInput.value = selectedCity; // Set the hidden input value
            cityDropdown.classList.add("hidden"); // Hide the dropdown after selection
        }
    });

    // Hide the dropdown if clicked outside
    document.addEventListener("click", function(event) {
        if (!cityTrigger.contains(event.target) && !cityDropdown.contains(event.target)) {
            cityDropdown.classList.add("hidden");
        }
    });

    // Main category dropdown
    // Toggle dropdown visibility when category is clicked
    mainTrigger.addEventListener("click", function() {
        // console.log("mainTrigger Clicked")
        mainDropdown.classList.toggle("hidden");
    });

    // Handle city selection
    mainDropdown.addEventListener("click", function(event) {
        const selectedMainCategory = event.target.getAttribute('data-category');
        if (selectedMainCategory) {
            selectedMainCategoryDisplay.textContent = selectedMainCategory; // Update the displayed category
            mainCategoryInput.value = selectedMainCategory; // Set the hidden input value
            console.log(mainCategoryInput)
            mainDropdown.classList.add("hidden"); // Hide the dropdown after selection
            subCatForm.classList.toggle("hidden");
        }
    });

    // Hide the dropdown if clicked outside
    document.addEventListener("click", function(event) {
        if (!mainTrigger.contains(event.target) && !mainDropdown.contains(event.target)) {
            mainDropdown.classList.add("hidden");
        }
    });

    // Function to ensure the input field is visible above the keyboard
    function ensureFieldVisible(element) {
        // Calculate the distance from the top of the element to the top of the viewport
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top;
        const elementBottom = rect.bottom;
    
        // Calculate the available viewport height
        const viewportHeight = window.innerHeight;

        // If the bottom of the element is below the visible viewport area, scroll it into view
        if (elementBottom > viewportHeight) {
            // Scroll the element into view
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // Add event listeners to handle focus on input fields
    document.querySelectorAll('input, textarea').forEach(field => {
        field.addEventListener('focus', function() {
            ensureFieldVisible(this);
        });
    });


    const sellForm = document.getElementById("sell-form");

    sellForm.addEventListener("submit", function (event) {
        event.preventDefault();
    
        const submitButton = document.getElementById("submit-btn");
        const loadingIndicator = document.getElementById("loading");
    
        // Disable the submit button and show the loading indicator
        //submitButton.disabled = true;
        submitButton.style.display = 'none';
        loadingIndicator.style.display = "block";
    
        const formData = new FormData(sellForm);

        // Validate that a city is selected
        const selectedCity = itemCityInput.value;
        if (!selectedCity) {
            alert("Please select a city.");
            submitButton.style.display = 'block';
            loadingIndicator.style.display = "none";
            return;
        }
    
        // Validate that at least one image is selected
        const itemImages = document.getElementById("item-images").files;
        if (itemImages.length === 0) {
            alert("Please attach at least one image.");
            submitButton.disabled = false;
            submitButton.style.display = 'block';
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

        // Append selected city to FormData
        formData.append('item-city', selectedCity);
        console.log(selectedCity);
    
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
            //submitButton.disabled = false;
            submitButton.style.display = 'block';
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
