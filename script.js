document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    // Check if username is stored in local storage
    let username = localStorage.getItem('username');
    if (!username) {
        // Prompt for username if not found in local storage
        username = prompt('Enter your username:');
        if (!username) {
            alert('You must enter a username to join the chat.');
            location.reload();
        }
        // Save username in local storage
        localStorage.setItem('username', username);
    }

    // Display existing messages
    socket.on('init', (initMessages) => {
        initMessages.forEach((msg) => displayMessage(msg));
    });

    // Send message
    document.getElementById('message-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const messageInput = document.getElementById('message-input');
        const message = messageInput.value.trim();
        if (message !== '') {
            const data = { username, message };
            socket.emit('message', data);
            displayMessage(data);
            messageInput.value = '';
        }
    });

    // Receive message
    socket.on('message', (data) => {
        displayMessage(data);
    });

    // Display message in chat window
    function displayMessage(data) {
        const { username, message } = data;
        const chatMessages = document.getElementById('chat-messages');
        const li = document.createElement('li');
        li.textContent = `${username}: ${message}`;
        chatMessages.appendChild(li);
    }
});
