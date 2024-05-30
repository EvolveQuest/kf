// Function to send a message and update UI immediately
async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value;

    if (messageText.trim() !== "") {
        // Update UI immediately
        displayMessage({
            text: messageText,
            sender: 'user'
        });
        messageInput.value = ''; // Clear input

        try {
            // Then, send to Firestore
            await addDoc(messagesRef, {
                text: messageText,
                timestamp: serverTimestamp(),
                sender: 'user'
            });
        } catch (error) {
            console.error('Error writing document: ', error);
        }
    }
}

// Function to display a message
function displayMessage(message) {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');

    // Check the sender to apply the correct styling
    if (message.sender === 'customerService') {
        messageElement.classList.add('customerService');
        messageElement.innerHTML = `<img src="Logo.png" alt="客服头像" class="avatar"><div class="messageBox">${message.text}</div>`;
    } else {
        messageElement.classList.add('user');
        messageElement.innerHTML = `<div class="messageBox">${message.text}</div>`;
    }
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight; // Scroll to the bottom
}
