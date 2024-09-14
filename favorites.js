// Initialize the Telegram WebApp instance
let tg = window.Telegram.WebApp;

document.addEventListener("DOMContentLoaded", function () {
    const chatId = localStorage.getItem('chatId');

    //const chatId = getChatIdFromCookie();
    console.log(chatId);
    //alert(chatId);

    // Check if chatId exists before making the API call
    if (!chatId) {
        alert('Restart the mini app please!');
        return;
    }

    // Show the Telegram back button in the top bar
    tg.BackButton.show();

    // Replace with your actual API URL
    fetch(`https://igebeya-bc68de5021c8.herokuapp.com/get_favorite?chat_id=${chatId}`)
        .then(response => response.json())
        .then(items => {
            const yyy = Array.isArray(items) ? items.map(fav => fav.id.toString()) : [];
            if (yyy.length === 0) {
                console.log("No favorites found.");
                alert("No items in favorite!");
                return;
                // You could display a message to the user here if needed
            }

            // Handle back button click event
            tg.onEvent('backButtonClicked', function() {
                // Go to the previous page using Telegram's built-in back button functionality
                window.history.back();  // You can use custom logic here as well
            });

            // console.log(items);  // Log the items to check the structure
            const itemsList = document.querySelector('.items-list');

            // Clear existing items in case this is a refresh
            itemsList.innerHTML = '';

            // Loop through each item and add to the DOM
            items.forEach(item => {
                const itemBox = document.createElement('div');
                itemBox.classList.add('item-box');

                // Set the data-id attribute with the item's unique identifier
                itemBox.setAttribute('data-id', item.id); // Assuming `item.id` is the unique ID of the item

                // Split the item pictures and create an array of image URLs
                const images = item.item_pic.split(',');

                // New layout with image on the left, text in the middle, and remove button on the right
                itemBox.innerHTML = `
                    <div class="item-content">
                        <img src="${images[0]}" alt="${item.item_name}" class="item-image">
                        <div class="item-details">
                            <p class="item-title">${item.item_name}</p>
                            <p class="item-price"><strong>ETB ${Number(item.item_price).toLocaleString()}</strong></p>
                            <p class="item-description">${item.item_description}</p>
                        </div>
                        <button class="remove-btn">Remove</button>
                    </div>
                `;

                // Add event listener for removing item
                itemBox.querySelector('.remove-btn').addEventListener('click', function (event) {
                    event.stopPropagation(); // Prevents the click from triggering the item details
                    const itemId = itemBox.getAttribute('data-id');
                    //console.log('Remove item ID:', itemId); // Replace with actual removal logic
                    // Send API request to remove the item from favorites
                    fetch(`https://igebeya-bc68de5021c8.herokuapp.com/remove_favorite?chat_id=${chatId}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ item_id: itemId }),
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                // Remove the item box from the DOM
                                itemBox.remove();
                                //console.log('Item removed from favorites');
                                alert('Item removed from favorites');
                            } else {
                                alert('Error removing item:');
                                //console.error('Error removing item:', data.message);
                            }
                        })
                        .catch(error => {
                            console.error('Error with remove request:', error);
                        });
                });

                // Add a click event listener to the item box
                itemBox.addEventListener('click', function () {
                    const itemId = this.getAttribute('data-id'); // Get the item ID from the data-id attribute
                    console.log('Item ID:', itemId); // Debugging line to check itemId
                    if (itemId) {
                        window.location.href = `item-details.html?id=${itemId}`; // Redirect to the details page with the item ID
                    } else {
                        //console.error('Item ID is undefined');
                        alert('Try again!');
                    }
                });

                // Append the item box to the list
                itemsList.appendChild(itemBox);
            });

            


        })
        .catch(error => {
            //console.error('Error fetching items:', error);
            alert('No items in favorite!');
        });
});
