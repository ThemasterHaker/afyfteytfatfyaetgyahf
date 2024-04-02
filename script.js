document.addEventListener('DOMContentLoaded', () => {
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

    // Display existing messages from local storage
    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    messages.forEach(displayMessage);

    // Function to send message
    window.sendMessage = function() {
        const messageInput = document.getElementById('message-input');
        const message = messageInput.value.trim();
        if (message !== '') {
            const data = { username, message };
            messages.push(data);
            localStorage.setItem('messages', JSON.stringify(messages)); // Save messages to local storage
            displayMessage(data);
            messageInput.value = '';
        }
    };

    // Function to display message in chat window
    function displayMessage(data) {
        const { username, message } = data;
        const chatMessages = document.getElementById('chat-messages');
        const li = document.createElement('li');
        li.textContent = `${username}: ${message}`;
        chatMessages.appendChild(li);
    }
});
