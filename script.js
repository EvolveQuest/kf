// Function to send a message and immediately display it on the page
async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value;

    if (messageText.trim() !== "") {
        try {
            // Add the message to the page immediately
            displayMessage(messageText, 'user');

            // Save the message to local storage
            saveMessageToLocalStorage(messageText);

            // Add the message to Firestore
            await addDoc(messagesRef, {
                text: messageText,
                timestamp: serverTimestamp(),
                sender: 'user'
            });
            
            messageInput.value = '';
        } catch (error) {
            console.error('Error writing document: ', error);
        }
    }
}

// Function to display a message on the page
function displayMessage(message, sender) {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.innerText = message;
    messagesDiv.appendChild(messageElement);
}

// Function to save the message to local storage
function saveMessageToLocalStorage(message) {
    // Retrieve existing messages from local storage
    let storedMessages = localStorage.getItem('messages');
    storedMessages = storedMessages ? JSON.parse(storedMessages) : [];

    // Add the new message to the stored messages
    storedMessages.push(message);

    // Save the updated messages to local storage
    localStorage.setItem('messages', JSON.stringify(storedMessages));
}

// Function to hide previously sent messages on page load
function hidePreviousMessages() {
    const storedMessages = localStorage.getItem('messages');
    if (storedMessages) {
        const messagesDiv = document.getElementById('messages');
        messagesDiv.innerHTML = ''; // Clear any previous messages
    }
}

// Initialize display welcome message and hide previous messages
window.onload = async () => {
    // Display welcome message
    displayWelcomeMessage();

    // Hide previous messages
    hidePreviousMessages();

    // Add event listener to the button
    document.getElementById('sendButton').addEventListener('click', sendMessage);
}
