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
    const chatId = tg.initDataUnsafe.user.id;
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

    // Sub category drop down
    // Subcategories mapped to their main categories
    // Populate the sub-category dropdown based on the selected main category
    const subCategoryList = document.getElementById('sub-category-list');
    const subTrigger = document.getElementById("sub-category-dropdown-trigger");
    const selectedSubCategoryDisplay = document.getElementById("selected-sub-category");
    const subCategoryInput = document.getElementById('item-sub-category');
    const subcategories = {
        'Appliances': ['Air Conditioners', 'Refrigerators', 'Washing Machines', 'All Appliances'],
        'Car & Motorbike': ['Car Accessories', 'Car Parts', 'Car Electronics', 'Motorbike Accessories & Parts', 'All Car & Motorbike Products'],
        'TV, Phones & Cameras': ['Phones', 'Laptops' ,'Televisions', 'Speakers', 'Cameras', 'Headphones', 'Home Audio & Theater', 'Camera Accessories', 'Security Cameras', 'All Electronics'],
        'Sports & Fitness': ['Badminton', 'Cardio Equipment', 'Fitness Accessories', 'Football', 'Running', 'Strength Training', 'All Sports, Fitness & Outdoors'],
        'Grocery & Gourmet Foods': ['Coffee, Tea & Beverages', 'Snack Foods', 'All Grocery & Gourmet Foods'],
        'Home & Kitchen': ['Furniture', 'Home Décor', 'Home Furnishing', 'Home Storage', 'Kitchen & Dining', 'Kitchen Storage & Containers', 'Home Improvement', 'All Home & Kitchen'],
        'Pet Supplies': ['Dog supplies', 'All Pet Supplies'],
        'Stores': ['Value Bazaar', 'Refurbished & Open Box'],
        'Toys & Baby Products': ['STEM Toys Store', 'Toys & Games', 'Baby Bath, Skin & Grooming', 'Strollers & Prams', 'Nursing & Feeding', 'Diapers', 'All Baby Products', 'International Toy Store'],
        'Kids\' Fashion': ['Kids\' Clothing', 'Kids\' Shoes', 'Kids\' Watches', 'Baby Fashion'],
        'Bags & Luggage': ['Backpacks', 'Handbags & Clutches', 'School Bags', 'Travel Accessories', 'Suitcases & Trolley Bags', 'All Bags & Luggage'],
        'Accessories': ['Sunglasses', 'Wallets', 'Jewellery', 'Fashion & Silver Jewellery', 'Gold & Diamond Jewellery', 'Travel Duffles', 'Fashion Sales & Deals'],
        'Women\'s Shoes': ['Ballerinas', 'Casual Shoes', 'Fashion Sandals'],
        'Beauty & Health': ['Make-up', 'Luxury Beauty', 'Beauty & Grooming', 'Diet & Nutrition', 'Health & Personal Care', 'Personal Care Appliances'],
        'Men\'s Shoes': ['Formal Shoes', 'Casual Shoes', 'Sports Shoes'],
        'Women\'s Clothing': ['Ethnic Wear', 'Lingerie & Nightwear', 'Western Wear', 'The Designer Boutique', 'Habesha Fashion'],
        'Industrial Supplies': ['Industrial & Scientific Supplies', 'Lab & Scientific', 'Janitorial & Sanitation Supplies', 'Test, Measure & Inspect'],
        'Men\'s Clothing': ['Shirts', 'Jeans', 'T-shirts & Polos', 'Habesha Fashion'],
        'Music': ['Musical Instruments & Professional Audio'],
        'Home, Kitchen, Pets': ['All Home & Kitchen', 'All Pet Supplies'],
        'Apartments & Lands': ['Rental Apartment','Apartment For Sale','Land For Sale']
    };
    

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

    // Handle main category selection
    mainDropdown.addEventListener("click", function(event) {
        const selectedMainCategory = event.target.getAttribute('data-category');
        if (selectedMainCategory) {
            selectedMainCategoryDisplay.textContent = selectedMainCategory; // Update the displayed category
            mainCategoryInput.value = selectedMainCategory; // Set the hidden input value
            // console.log(mainCategoryInput)
            mainDropdown.classList.add("hidden"); // Hide the dropdown after selection
            document.getElementById("hidden-sub-category-form").style.display = "block";

            // Populate the sub category based on the main category selected
            subCategoryList.innerHTML = ''; // Clear previous subcategories

            // Get the subcategories for the selected main category
            const selectedSubcategories = subcategories[selectedMainCategory] || [];

            // Populate the sub-category list
            selectedSubcategories.forEach(subCategory => {
                const listItem = document.createElement('li');
                listItem.setAttribute('data-subcategory', subCategory);
                listItem.dataset.subcategory = subCategory;
                listItem.textContent = subCategory;
                subCategoryList.appendChild(listItem);
            });

            // Reset sub category if previously selected
            selectedSubCategoryDisplay.textContent = 'Sub category';
            subCategoryInput.value = '';
        }
    });

    // Hide the dropdown if clicked outside
    document.addEventListener("click", function(event) {
        if (!mainTrigger.contains(event.target) && !mainDropdown.contains(event.target)) {
            mainDropdown.classList.add("hidden");
        }
    });

    // Sub dropdown
    // Toggle dropdown visibility when sub is clicked
    subTrigger.addEventListener("click", function() {
        subCategoryList.classList.toggle("hidden");
    });

    // Handle sub selection
    subCategoryList.addEventListener("click", function(event) {
        const selectedsub = event.target.getAttribute('data-subcategory');
        if (selectedsub) {
            selectedSubCategoryDisplay.textContent = selectedsub; // Update the displayed city
            subCategoryInput.value = selectedsub; // Set the hidden input value
            subCategoryList.classList.add("hidden"); // Hide the dropdown after selection
        }
    });

    // Hide the dropdown if clicked outside
    document.addEventListener("click", function(event) {
        if (!subTrigger.contains(event.target) && !subCategoryList.contains(event.target)) {
            subCategoryList.classList.add("hidden");
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
        const selectedsub = subCategoryInput.value;
        const selectedmain = mainCategoryInput.value
        
        if (!selectedCity || !selectedsub || !selectedmain) {
            alert("Please select required fields.");
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
    
        // Append chat id
        if (chatId) {
            formData.append('chat_id', chatId);
        } else {
            alert("Please restart the mini app!");
            return;
        }

        // Append selected city to FormData
        formData.append('item-city', selectedCity);
        formData.append('item-main-category', selectedmain);
        formData.append('item-sub-category', selectedsub);
        // console.log(selectedCity, selectedmain, selectedsub);
    
        // Send data to backend
        fetch('https://igebeya3-272f297966dc.herokuapp.com/list_item', {
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
            // console.error('Error:', error);
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

        // Check if chatId exists before making the API call
        if (!chatId) {
            // console.error('Chat ID not found in localStorage.');
            alert('No chat id! Restart App!');
            return;
        }

        // Fetch the items listed by the user
        fetch(`https://igebeya3-272f297966dc.herokuapp.com/get_user_items?chat_id=${chatId}`)
            .then(response => response.json())
            .then(items => {
                if (items.length === 0) {
                    myListedItemsContainer.innerHTML = `<p class="no-items">No items listed yet.</p>`;
                    return;
                }

                // Populate the listed items in the DOM
                items.forEach(item => {
                    let icon;
                    const images = item.item_pic.split(',');  // Assuming multiple images are separated by a comma
                    const itemRow = document.createElement('div');
                    itemRow.classList.add('listed-item-row');
                    
                    if(item.boosted==='nop'){
                        icon = "🪫";
                    }else{
                        icon = "🔋";
                    }

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
                            <p>${icon}</p>
                        </div>
                        <div class="item-unlist">
                            <button class="unlist-button" data-id="${item.id}">Unlist</button>
                            <button class="boost-button" data-id="${item.id}">Boost</button>
                        </div>
                    `;

                    // Add the item row to the container
                    myListedItemsContainer.appendChild(itemRow);
                });

                // Add event listeners for the "Unlist" buttons
                document.querySelectorAll('.unlist-button').forEach(button => {
                    button.addEventListener('click', function () {
                        const itemId = this.getAttribute('data-id');
                        const itemData = {'itemId': itemId};
                        unlistItem(itemData);  // Unlist the item by calling the backend
                    });
                });

                // Add event listeners for the "boost" buttons
                document.querySelectorAll('.boost-button').forEach(button => {
                    button.addEventListener('click', function () {
                        const itemId = this.getAttribute('data-id');
                        const itemData = {'itemId': itemId, 'chatId': chatId}
                        boostItem(itemData);  // Unlist the item by calling the backend
                    });
                });
            })
            .catch(error => {
                // console.error('Error fetching listed items:', error);
                myListedItemsContainer.innerHTML = `<p>Failed to fetch listed items.</p>`;
            });
    }

    // Function to unlist an item
    function unlistItem(itemData) {
        // Make a request to the backend to unlist the item
        fetch(`https://igebeya3-272f297966dc.herokuapp.com/unlist_item`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(itemData)
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
            // console.error('Error unlisting item:', error);
            alert('An error occurred while trying to unlist the item.');
        });
    }

    // Function to boost an item
    function boostItem(itemData) {
        // Make a request to the backend to unlist the item
        fetch(`https://igebeya3-272f297966dc.herokuapp.com/boost_item`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(itemData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Item successfully boosted.');
                fetchListedItems();  // Refresh the listed items
            } else {
                alert(data.error);
            }
        })
        .catch(error => {
            // console.error('Error unlisting item:', error);
            alert('An error occurred while trying to boost the item.');
        });
    }
});
