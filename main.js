// Initialize the Telegram WebApp instance
const tg = window.Telegram.WebApp;
const chatId = tg.initDataUnsafe.user.id;


start();

function start(){
    fetch(`https://igebeya3-272f297966dc.herokuapp.com/user_status?chat_id=${chatId}`)
            .then(response => response.json())
            .then(status => {
                // alert(status.info);

                // Check the user status and forward accordingly
                if (status.info === "Logged_in") {
                    window.location.href = "/shop.html";
                } else if (status.info === "Logged_out") {
                    window.location.href = "/login.html";
                } else if (status.info === "New_user"){
                    window.location.href = "/signup.html";
                }
            })
            .catch((error) => console.error('Error:', error));
        }

