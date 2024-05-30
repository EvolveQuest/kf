// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-analytics.js";
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, getDocs, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBI0mLoUz8mSJnGF6lNxiDg9rBLSqRrmTw",
    authDomain: "kfxt-7d2f1.firebaseapp.com",
    projectId: "kfxt-7d2f1",
    storageBucket: "kfxt-7d2f1.appspot.com",
    messagingSenderId: "355905987432",
    appId: "1:355905987432:web:2ca15e137a7a824de8acdd",
    measurementId: "G-L9S3H9RZXC"
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

    console.log("Message text:", messageText); // 添加调试信息

    if (messageText.trim() !== "") {
        try {
            await addDoc(messagesRef, {
                text: messageText,
                timestamp: serverTimestamp(),
                sender: 'user'
            });
            messageInput.value = '';
            console.log("Message sent successfully"); // 添加调试信息
        } catch (error) {
            console.error('Error writing document: ', error);
        }
    }
}

// Function to clear all messages except the welcome message
async function clearMessages() {
    const querySnapshot = await getDocs(messagesRef);
    querySnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
    });
}

// Function to display messages
function displayMessages() {
    const q = query(messagesRef, orderBy('timestamp'));
    onSnapshot(q, (snapshot) => {
        const messagesDiv = document.getElementById('messages');
        messagesDiv.innerHTML = ''; // Clear messages before displaying new ones

        // Display custom message first
        const customMessageElement = document.createElement('div');
        customMessageElement.classList.add('message', 'customerService');
        customMessageElement.innerHTML = `<img src="Logo.png" alt="客服头像" class="avatar"><div class="messageBox">${customMessage}</div>`;
        messagesDiv.appendChild(customMessageElement);

        snapshot.forEach((doc) => {
            const message = doc.data();
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
        });

        // Scroll to the bottom
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });
}

// Function to display welcome message
function displayWelcomeMessage() {
    const messagesDiv = document.getElementById('messages');

    // Display custom welcome message
    const welcomeMessageElement = document.createElement('div');
    welcomeMessageElement.classList.add('message', 'customerService');
    welcomeMessageElement.innerHTML = `<img src="Logo.png" alt="客服头像" class="avatar"><div class="messageBox">${customMessage}</div>`;
    messagesDiv.appendChild(welcomeMessageElement);
}

// Initialize display messages and welcome message
window.onload = async () => {
    // Clear all messages except the welcome message
    await clearMessages();

    // Display welcome message
    displayWelcomeMessage();

    // Display messages from Firestore
    displayMessages();

    // Add event listener to the button
    document.getElementById('sendButton').addEventListener('click', sendMessage);
}
