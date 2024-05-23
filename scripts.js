document.addEventListener("DOMContentLoaded", function() {
    // Function to fetch contacts from the backend
    function fetchContacts() {
        fetch("/users/")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to fetch contacts");
                }
                return response.json();
            })
            .then(data => {
                // Display contacts in the sidebar
                const sidebar = document.getElementById("sidebar");
                sidebar.innerHTML = ""; // Clear previous contacts
                data.forEach(user => {
                    const contactElement = document.createElement("div");
                    contactElement.classList.add("contact");
                    contactElement.textContent = user.username;
                    sidebar.appendChild(contactElement);
                });
                // Add click event listeners to contacts after fetching
                addContactListeners();
            })
            .catch(error => {
                console.error("Error fetching contacts:", error.message);
            });
    }

    function addContactListeners() {
        const contactElements = document.querySelectorAll(".contact");
        contactElements.forEach(contactElement => {
            contactElement.addEventListener("click", function() {
                const selectedContact = this.textContent;
                // Set chat header to the selected contact name
                const chatHeader = document.getElementById("chat-header");
                chatHeader.textContent = selectedContact;
            });
        });
    }

    // Add event listener to the "All Chats" contact
    const allChats = document.getElementById("all-chats");
    allChats.addEventListener("click", function() {
        const chatHeader = document.getElementById("chat-header");
        chatHeader.textContent = "All Chats";
    });

    // Fetch contacts from the backend when the page loads
    fetchContacts();

    // Add event listener to the send button
    const sendButton = document.getElementById("send-button");
    sendButton.addEventListener("click", function() {
        const selectedContact = document.getElementById("chat-header").textContent;
        const messageInput = document.getElementById("message-input");
        const message = messageInput.value.trim();
        if (message !== "") {
            // Create message object
            const messageData = {
                sender: "Me", // Assuming sender is the logged-in user
                receiver: selectedContact,
                message: message
            };
            // Send message to the backend
            sendMessage(messageData);
            // Clear message input field
            messageInput.value = "";
        }
    });

    // Function to send message to the backend
    function sendMessage(message) {
        fetch("/send_message/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(message)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to send message");
            }
            console.log("Message sent successfully");
        })
        .catch(error => {
            console.error("Error sending message:", error.message);
        });
    }

});
