<!DOCTYPE html>
<html>
<head>
    <title>在线服务</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" type="text/css" href="styles.css">
</head>
<body>
    <div id="header">
        <img src="Logo.png" alt="Logo">
        <h1>客服</h1>
    </div>
    <div id="chat">
        <div id="messages"></div>
        <div id="inputArea">
            <input type="text" id="messageInput" placeholder="在这里输入你的消息">
            <button id="sendButton">发送</button>
        </div>
    </div>
    <script>
        // Your JavaScript code here
        import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
        import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-analytics.js";
        import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";
        import { v4 as uuidv4 } from 'https://cdn.jsdelivr.net/npm/uuid/dist/umd/v4.js';

        // Your Firebase configuration
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
        const db = getFirestore(app);

        // Reference to the Firestore collection
        let messagesRef;

        // Function to generate unique user ID
        function generateUserId() {
            // Generate a UUID (unique identifier)
            return uuidv4();
        }

        // Function to get or generate user ID from Cookie
        function getUserId() {
            let userId = getCookie("userId");
            if (!userId) {
                userId = generateUserId();
                // Set user ID in Cookie
                setCookie("userId", userId, 30); // Cookie expires in 30 days
            }
            return userId;
        }

        // Function to set Cookie
        function setCookie(name, value, days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            const expires = "expires=" + date.toUTCString();
            document.cookie = name + "=" + value + ";" + expires + ";path=/";
        }

        // Function to get Cookie value by name
        function getCookie(name) {
            const decodedCookie = decodeURIComponent(document.cookie);
            const cookies = decodedCookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.startsWith(name + '=')) {
                    return cookie.substring(name.length + 1);
                }
            }
            return null;
        }

        // Function to send a message
        async function sendMessage() {
            const messageInput = document.getElementById('messageInput');
            const messageText = messageInput.value;

            if (messageText.trim() !== "") {
                try {
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

        // Function to display messages
        function displayMessages() {
            const q = query(messagesRef, orderBy('timestamp'));
            onSnapshot(q, (snapshot) => {
                const messagesDiv = document.getElementById('messages');
                messagesDiv.innerHTML = ''; // Clear messages before displaying new ones

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

        // Function to initialize user and messages
        function initializeUser() {
            const userId = getUserId();
            // Reference to the Firestore collection for the user
            messagesRef = collection(db, 'users', userId, 'messages');
            // Display messages from Firestore
            displayMessages();
        }

        // Initialize user and messages
        initializeUser();

        // Add event listener to the button
        document.getElementById('sendButton').addEventListener('click', sendMessage);
    </script>
</body>
</html>
