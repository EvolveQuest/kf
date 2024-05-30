// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-analytics.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    // Your Firebase configuration
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);

// Reference to the Firestore collection
const messagesRef = collection(db, 'messages');

// Custom welcome message
const customMessage = '请将您的问题和支付订单号一起发送，并留下您的联系方式（推荐使用Telegram），我们会尽快回复您，谢谢！';

// Function to send a message
async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value;

    if (messageText.trim() !== "") {
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

// Function to display welcome message
function displayWelcomeMessage() {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = ''; // Clear any previous messages

    // Display custom welcome message
    const welcomeMessageElement = document.createElement('div');
    welcomeMessageElement.classList.add('message', 'customerService');
    welcomeMessageElement.innerHTML = `<img src="Logo.png" alt="客服头像" class="avatar"><div class="messageBox">${customMessage}</div>`;
    messagesDiv.appendChild(welcomeMessageElement);
}

// Initialize display welcome message and attach event listeners
window.onload = async () => {
    // Display welcome message
    displayWelcomeMessage();

    // Add event listener to the button
    document.getElementById('sendButton').addEventListener('click', sendMessage);
}
