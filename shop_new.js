// TG instance for close button
const tg = window.Telegram.WebApp;
let itemDetailsDict = {};
const chatId = tg.initDataUnsafe.user.id;

// Session tracker
let userSessionData = {};
let currentTimestamp;
let cookies;
let UserCookiesConsent;
let timestampCookiesDeclined;

// Initialize URLSearchParams from the window location
// const urlParams = new URLSearchParams(window.location.search);

// Check if the URL has any search parameters
// if (urlParams.toString()) {
//     const chatId = urlParams.get('chat_id');
//     localStorage.setItem('chatId', chatId);
//     console.log("saved chat ID to local storage: ",chatId);
// }
// const chatId = localStorage.getItem('chatId');
// console.log("Retrieved chat ID from local storage: ",chatId);



// Function to generate an integer timestamp (Unix time in seconds)
function generateTimestamp() {
    const date = new Date();
    return Math.floor(date.getTime() / 1000);  // Converts milliseconds to seconds
}

// Function to send data to the backend
function sendDataToBackend(data) {
    fetch('https://igebeya3-272f297966dc.herokuapp.com/save_session_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            console.error("Response status:", response.status);
            return response.json().then(err => {
                console.error("Error details:", err);
                alert(err);
                throw new Error("Server responded with error");
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Data sent and saved:', data);
        // Clear userSessionData after successfully sending to backend
        localStorage.removeItem(`${chatId}_userSessionData`);
    })
    .catch((error) => console.error('Error:', error));
}

// Check if userSessionData exists in localStorage and is not empty
function checkAndSendExistingData() {
    let storedData = localStorage.getItem(`${chatId}_userSessionData`);

    //let xx = JSON.parse(storedData);
    console.log("Stored data:", storedData);  // Output the data type


    if (storedData == null) {
        // alert("Stored data is null, creating new session data!");
        //currentTimestamp = generateTimestamp();
        // Check if the session for this chat ID exists, if not, initialize
        userSessionData[chatId] = userSessionData[chatId] || {};
        //userSessionData[chatId][currentTimestamp] = {}; // Create a new entry for the current session
        console.log("Created new users session data:", userSessionData);
        localStorage.setItem(`${chatId}_userSessionData`, JSON.stringify(userSessionData));

        
    } else {
        // alert("Stored data found, checking timestamp");
        // alert(storedData);
        storedData = JSON.parse(storedData);

        // Get the last timestamp in the stored data
        // Get all timestamps for the chat ID
        let timestamps = Object.keys(storedData[chatId]);

        // Get the last timestamp
        let lastTimestamp = timestamps[timestamps.length - 1];
        console.log("Last time stamp",lastTimestamp);

        let currentTime = generateTimestamp();
        
        // Calculate the time difference in seconds (12 hours = 43,200 seconds)
        let timeDifference = currentTime - parseInt(lastTimestamp);
        // alert ("Before time difference");

        if (timeDifference >= 60 && Object.keys(storedData[chatId]).length > 0) {
            cookies = localStorage.getItem(`${chatId}_YesCookiesPlease`);
            if (!cookies){
                UserCookiesConsent = "No";
            } else {
                UserCookiesConsent = "yes";
            }
            // alert("Inside time difference");
            // If time difference is more than 12 hours and dict not empty, send data to backend
            sendDataToBackend({ chat_id: chatId, session_data: storedData, cookies: UserCookiesConsent});

            // Proceed with normal session process
            //currentTimestamp = generateTimestamp();
            // Check if the session for this chat ID exists, if not, initialize
            userSessionData[chatId] = userSessionData[chatId] || {};
            //userSessionData[chatId][currentTimestamp] = {}; // Create a new entry for the current session
            // Store the updated session data in localStorage
            localStorage.setItem(`${chatId}_userSessionData`, JSON.stringify(userSessionData));
        } else {
            console.log(`Skipping sending data. Last session was ${timeDifference / 3600} hours ago.`);
        }
        
    }
}

// Call this function when the mini app is opened or user returns
function startSession() {
    // Check for existing session data in localStorage
    checkAndSendExistingData(); 
}

// Function to track user interaction with items
function trackUserInteraction(itemName, mainCategory, subCategory, action) {
    // Record interaction with main and subcategories
    let userSessionData = JSON.parse(localStorage.getItem(`${chatId}_userSessionData`));
    currentTimestamp = generateTimestamp();
    // Add the interaction details
    userSessionData[chatId][currentTimestamp] = {
        'item': itemName,
        'main category': mainCategory,
        'sub category': subCategory,
        'action': action
    };
    
    // Update localStorage with the new session data
    localStorage.setItem(`${chatId}_userSessionData`, JSON.stringify(userSessionData));
}

// Track page history
function updatePageHistory(pageName) {
    // Retrieve existing history from localStorage or initialize an empty array
    let pageHistory = JSON.parse(localStorage.getItem('pageHistory')) || [];
    
    // Add the current page to the history
    pageHistory.push(pageName);
    
    // Save the updated history back to localStorage
    localStorage.setItem('pageHistory', JSON.stringify(pageHistory));
}

startSession(); // Call this function to track timestamp and usersessions
updatePageHistory('shop.html'); // Call this with each page the user navigates to

document.addEventListener("DOMContentLoaded", function () {
    // alert("inside the DOM");
    const searchButton = document.querySelector('.search-button');
    const header = document.querySelector('.header');
    const searchInput = document.getElementById('search-input');
    const itemsList = document.querySelector('.items-list');

    // Load more and Back to top buttons
    const loadMoreButton = document.getElementById('load-more');
    const showMoreButton = document.getElementById('show-more');
    const backToTopButton = document.getElementById('back-to-top');

    // City drop down
    const cityTrigger = document.getElementById("city-dropdown-trigger");
    const cityDropdown = document.getElementById("city-dropdown");
    const selectedCity = document.getElementById("selected-city");
    let savedCity = localStorage.getItem(`${chatId}_userCity`);

    // If the user is first time comer set city to Anywhere by default
    if (!savedCity){
        let city = "Anywhere";
        localStorage.setItem(`${chatId}_userCity`, city);
    }

    // Cookies consent
    const acceptCookies = document.getElementById('accept-cookies');
    const declineCookies = document.getElementById('decline-cookies');

    cookies = localStorage.getItem(`${chatId}_YesCookiesPlease`);
    let noCookies = localStorage.getItem(`${chatId}_NoCookiesPlease`);
    
    if (!cookies && !noCookies){
        document.getElementById('cookie-banner').style.display = 'flex';
    } else if (noCookies){
        let nowTimestamp = generateTimestamp();
        let diffCookiesTime;
        diffCookiesTime = nowTimestamp - parseInt(noCookies);
        
        if (diffCookiesTime >= 60){
            localStorage.removeItem(`${chatId}_NoCookiesPlease`);
            document.getElementById('cookie-banner').style.display = 'flex';
        } 
    }
    
    // For either first time comers or others set whatever is saved in the local storage 
    // (either Anywhere or users choice) and then update the selected city handle
    city = localStorage.getItem(`${chatId}_userCity`);
    selectedCity.textContent = city;
    
    
    tg.BackButton.hide();

    let start = 0; // Start index for items
    let startSearch = 0; // start index for search items
    const limit = 20; // Number of items to load per batch
    let boosted_offset = 0;
    let currentItems = [];
    let favSearch = [];

    // Cookies
    acceptCookies.addEventListener('click', function() {
        localStorage.setItem(`${chatId}_YesCookiesPlease`, "Yes, I consent to cookies on this mini app!");
        document.getElementById('cookie-banner').style.display = 'none';
    });

    declineCookies.addEventListener('click', function() {
        timestampCookiesDeclined = generateTimestamp();
        localStorage.setItem(`${chatId}_NoCookiesPlease`, timestampCookiesDeclined);
        document.getElementById('cookie-banner').style.display = 'none';
    });

    // Load initial batch of items
    displayItems(start, limit, boosted_offset);

    // Add event listener to the "Load More" button
    loadMoreButton.addEventListener('click', function () {
        start += limit;  // Increment the start index
        boosted_offset += 4;
        displayItems(start, limit, boosted_offset);  // Fetch and display the next batch of items
    });

    // Add event listener to the "Back to Top" button
    backToTopButton.addEventListener('click', function () {
        backToTopButton.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Toggle header visibility when search button is clicked
    searchButton.addEventListener('click', function (event) {
        event.preventDefault();  // Prevent default link behavior if it's a link
        if (header.style.display === 'none') {
            header.style.display = 'flex';  // Show the header
        } else {
            header.style.display = 'none';  // Hide the header if already shown
        }
    });

    // City dropdown
    // Toggle dropdown visibility when city is clicked
    cityTrigger.addEventListener("click", function() {
        cityDropdown.classList.toggle("hidden");

        // Prevent background scroll if the dropdown is visible
        if (!cityDropdown.classList.contains("hidden")) {
            document.body.classList.add("no-scroll");
        } else {
            document.body.classList.remove("no-scroll");
        }
    });

    // Handle city selection
    cityDropdown.addEventListener("click", function(event) {
        if (event.target.tagName === 'LI') {
            city = event.target.getAttribute("data-city");
            selectedCity.textContent = city; // Update the header with selected city

            // Hide the dropdown after selection
            cityDropdown.classList.add("hidden");
            document.body.classList.remove("no-scroll");

            if (city){
                // handle buttons
                showMoreButton.style.display = 'none';
                backToTopButton.style.display = 'none';
                loadMoreButton.style.display = 'block';

                // save selected new city to local storage
                localStorage.setItem(`${chatId}_userCity`, city);

                // Proceed to displaying items
                startSearch -= startSearch;
                start -= start;
                boosted_offset -= boosted_offset;
                displayItems(start, limit, boosted_offset);
            }

            // Optionally, perform any additional action based on the selected city (e.g., filter search results)
            // if (city !== 'Anywhere'){
            //     loadMoreButton.style.display = 'none';
            //     backToTopButton.style.display = 'none';
            //     handleSearch(city);
            // }else{
            //     showMoreButton.style.display = 'none';
            //     backToTopButton.style.display = 'none';
            //     loadMoreButton.style.display = 'block';
            //     startSearch -= startSearch;
            //     start -= start;
            //     displayItems(start, limit);
            // }
            
        }
    });

    // Hide the dropdown if clicked outside
    document.addEventListener("click", function(event) {
        if (!cityTrigger.contains(event.target) && !cityDropdown.contains(event.target)) {
            cityDropdown.classList.add("hidden");
            document.body.classList.remove("no-scroll");
        }
    });

    // Prevent touch scrolling on the background when interacting with the dropdown
    cityDropdown.addEventListener("touchmove", function(event) {
        event.stopPropagation(); // Stop the event from propagating to the background
    });


    function displayItems(start, limit, boosted_offset) {
        // Fetch user's favorites
    fetch(`https://igebeya3-272f297966dc.herokuapp.com/get_favorite?chat_id=${chatId}`)
        .then(response => response.json())
        .then(favorites => {
            // Ensure favorites is an array
            const favoriteIds = Array.isArray(favorites) ? favorites.map(fav => fav.id.toString()) : [];

            if (favoriteIds.length === 0) {
                console.log("No favorites found.");
            }


            // Fetch all items
            fetch(`https://igebeya3-272f297966dc.herokuapp.com/get_items?start=${start}&limit=${limit}&chat_id=${chatId}&city=${city}&boosted_offset=${boosted_offset}`)
                .then(response => response.json())
                .then(items => {
                    const itemsList = document.querySelector('.items-list');
                    if (start === 0) {
                        // Clear the items list only if this is the initial load
                        itemsList.innerHTML = '';
                    }
    
                    if (items.length === 0) {
                        if (start > 0) {
                            alert("No more new items in your area!")
                            loadMoreButton.style.display = 'none';  // Hide button if no more items
                            backToTopButton.style.display = 'block'; // Show the Back to Top button
                        } else {
                            loadMoreButton.style.display = 'none';
                            backToTopButton.style.display = 'none';
                            itemsList.innerHTML = `
                            <p id="no-items-found">
                                <i class="fas fa-search icon"></i> <!-- Search icon -->
                                No items listed yet! :(
                            </p>`;
                        }
                        
                    } else {

                    // Loop through each item and add to the DOM
                    items.forEach(item => {
                        const itemBox = document.createElement('div');
                        itemBox.classList.add('item-box');
                        itemBox.setAttribute('data-id', item.id);

                        // Add the item details to the dictionary using item.id as the key
                        itemDetailsDict[item.id] = {
                            'itemName': item.item_name,
                            'itemMain': item.item_main,
                            'itemSub': item.item_sub
                        };
                        console.log(itemDetailsDict);

                        const images = item.item_pic.split(',');


                        // Determine if the item is in favorites
                        const isLiked = favoriteIds.includes(item.id.toString());

                        // Set heart icon class based on liked status
                        const heartIconClass = isLiked ? 'fas fa-heart like-icon liked' : 'fas fa-heart like-icon';
                        
                        // Determine if the item is boosted
                        const isBoosted = item.boosted === 'yep';


                        // Inner HTML for the item box
                        itemBox.innerHTML = `
                            <img src="${images[0]}" alt="${item.item_name}">
                            <div class="item-details">
                                <div class="price-and-icon">
                                    <p class="item-price"><strong>ETB ${Number(item.item_price).toLocaleString()}</strong></p>
                                    <i class="${heartIconClass}"></i>
                                </div>
                                ${isBoosted ? `
                                    <div class="boost-badge">
                                        <i class="fas fa-star"></i> Boosted
                                    </div>
                                ` : ''}
                                <p class="item-title">${item.item_name}</p>
                                <p class="item-description">${item.item_description}</p>
                                <p class="item-city">
                                    <i class="fas fa-map-marker-alt"></i> ${item.item_city}
                                </p>
                            </div>
                        `;

                        // Add a click event listener to the heart icon
                        const heartIcon = itemBox.querySelector('.like-icon');
                        heartIcon.addEventListener('click', function (event) {
                            event.stopPropagation();

                            const itemId = itemBox.getAttribute('data-id');
                            console.log('Heart clicked for item ID:', itemId);

                            // Toggle the liked class
                            if (heartIcon.classList.contains('liked')) {
                                heartIcon.classList.remove('liked');
                                removeFromFavorites(itemId);
                            } else {
                                heartIcon.classList.add('liked');
                                addToFavorites(itemId);
                            }
                        });

                        // Add a click event listener to the item box (for navigating to item details)
                        itemBox.addEventListener('click', function () {
                            const itemId = itemBox.getAttribute('data-id');
                            console.log('Item ID:', itemId);
                            if (itemId) {
                                window.location.href = `item-details.html?id=${itemId}`;
                            } else {
                                console.error('Item ID is undefined');
                            }
                        });

                        // Append the item box to the list
                        itemsList.appendChild(itemBox);
                    });
                    loadMoreButton.style.display = 'block';
                }
                })
                .catch(error => {
                    console.error('Error fetching items:', error);
                });
        })
        .catch(error => {
            console.error('Error fetching favorites:', error);
        });
    }


    // Debounce function to delay search requests
    function debounce(fn, delay) {
        let timeoutId;
        return function(...args) {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                fn(...args);
            }, delay);
        };
    }

    // Function to display items in chunks
    function displayItemsSearch(items, startIndex, limit, favSearch) {
        const endIndex = Math.min(startIndex + limit, items.length);

        for (let i = startIndex; i < endIndex; i++) {
            const item = items[i];
            const itemBox = document.createElement('div');
            itemBox.classList.add('item-box');
            itemBox.setAttribute('data-id', item.id);

            const images = item.item_pic.split(',');

            // Determine if the item is in favorites
            const isLiked = favSearch.includes(item.id.toString());

            // Set heart icon class based on liked status
            const heartIconClass = isLiked ? 'fas fa-heart like-icon liked' : 'fas fa-heart like-icon';

            // Determine if the item is boosted
            const isBoosted = item.boosted === 'yep';
            alert(item.boosted);

            itemBox.innerHTML = `
                <img src="${images[0]}" alt="${item.item_name}">
                <div class="item-details">
                    <div class="price-and-icon">
                        <p class="item-price"><strong>ETB ${Number(item.item_price).toLocaleString()}</strong></p>
                        <i class="${heartIconClass}"></i>
                    </div>
                    ${isBoosted ? `
                        <div class="boost-badge">
                            <i class="fas fa-star"></i> Boosted
                        </div>
                    ` : ''}
                    <p class="item-title">${item.item_name}</p>
                    <p class="item-description">${item.item_description}</p>
                    <p class="item-city">
                        <i class="fas fa-map-marker-alt"></i> ${item.item_city}
                    </p>
                </div>
            `;

            // Add a click event listener to the heart icon
            const heartIcon = itemBox.querySelector('.like-icon');
            heartIcon.addEventListener('click', function (event) {
                event.stopPropagation();

                const itemId = itemBox.getAttribute('data-id');
                console.log('Heart clicked for item ID:', itemId);

                // Toggle the liked class
                if (heartIcon.classList.contains('liked')) {
                    heartIcon.classList.remove('liked');
                    removeFromFavorites(itemId);
                } else {
                    heartIcon.classList.add('liked');
                    addToFavorites(itemId);
                }
            });

            // Add click event listener for item details
            itemBox.addEventListener('click', function () {
                window.location.href = `item-details.html?id=${item.id}`;
            });

            itemsList.appendChild(itemBox);
        }

        // Check if more items are available, if not, hide the "Load More" button
        if (endIndex >= items.length) {
            showMoreButton.style.display = 'none';
            backToTopButton.style.display = 'block';
        } else {
            showMoreButton.style.display = 'block';
        }
    }

    // Handle "Load More" button click
    showMoreButton.addEventListener('click', function() {
        startSearch += limit;
        displayItemsSearch(currentItems, startSearch, limit, favSearch); // Load next set of items
    });

    // Function to handle search request
    function handleSearch(query) {
        if (query.trim() !== "") {
            fetch(`https://igebeya3-272f297966dc.herokuapp.com/get_favorite?chat_id=${chatId}`)
        .then(response => response.json())
        .then(favorites => {
            // Ensure favorites is an array
            favSearch = Array.isArray(favorites) ? favorites.map(fav => fav.id.toString()) : [];
            // Send a request to the server-side search endpoint
            fetch(`https://igebeya3-272f297966dc.herokuapp.com/search_items?q=${encodeURIComponent(query)}`)
                .then(response => response.json())
                .then(data => {
                    // Clear previous search results
                    itemsList.innerHTML = '';
                    

                    // Populate the itemsList with new search results
                    if (data.length > 0) {
                        // Clear previous search results
                        itemsList.innerHTML = '';

                        // Save the items fetched for pagination
                        currentItems = data;
                        console.log("items from search",currentItems);

                        // Initially display only the first set of items (4 items)
                        startSearch = 0;
                        displayItemsSearch(currentItems, startSearch, limit, favSearch);
                        
                    
                    } else {
                        showMoreButton.style.display = 'none';
                        backToTopButton.style.display = 'none';
                        itemsList.innerHTML = `
                        <p id="no-items-found">
                            <i class="fas fa-search icon"></i> <!-- Search icon -->
                            No items found.
                        </p>`;
                    }
                })
                .catch(error => {
                    console.error('Error fetching search results:', error);
                });
        });
        }
        else {
            showMoreButton.style.display = 'none';
            backToTopButton.style.display = 'none';
            loadMoreButton.style.display = 'block';
            itemsList.innerHTML = ''; // Clear results if query is empty
            startSearch -= startSearch;
            start -= start;
            boosted_offset -= boosted_offset;
            displayItems(start, limit, boosted_offset);
        }
    }

    // Attach debounce to search input
    searchInput.addEventListener('input', debounce(function (event) {
        const query = event.target.value;
        loadMoreButton.style.display = 'none';
        handleSearch(query);
    }, 300)); // 300ms delay

    // Handle "Enter" key press to dismiss the keyboard
    searchInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default action like form submission
            searchInput.blur(); // Remove focus from the input to hide the keyboard
        }
    });
});

// Function to add item to favorites
function addToFavorites(itemId) {
    const item = itemDetailsDict[itemId];
    if (!itemId || !chatId) return;
    console.log('item ID:', itemId);

    // Call API to add to favorites (implement server-side logic for adding)
    fetch(`https://igebeya3-272f297966dc.herokuapp.com/add_favorite?chat_id=${chatId}`, {
        method: 'POST',
        headers: {
                            'Content-Type': 'application/json',
                        },
        body: JSON.stringify({id: itemId})
    }).then(response => response.json())
      .then(data => {
        trackUserInteraction(item.itemName, item.itemMain, item.itemSub, 'favorite');
        console.log('Item added to favorites:', data);
      }).catch(error => {
          console.error('Error adding to favorites:', error);
      });
}

// Function to remove item from favorites
function removeFromFavorites(itemId) {
    if (!itemId || !chatId) return;

    // Call API to remove from favorites (implement server-side logic for removal)
    fetch(`https://igebeya3-272f297966dc.herokuapp.com/remove_favorite?chat_id=${chatId}`, {
        method: 'POST',
        headers: {
                            'Content-Type': 'application/json',
                        },
        body: JSON.stringify({item_id: itemId})
    }).then(response => response.json())
      .then(data => {
          console.log('Item removed from favorites:', data);
      }).catch(error => {
          console.error('Error removing from favorites:', error);
      });
}

