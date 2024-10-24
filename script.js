// script.js
let currentUser = '';

function login() {
    const usernameInput = document.getElementById('username');
    currentUser = usernameInput.value.trim();
    if (currentUser !== '') {
        document.getElementById('login-box').classList.add('hidden');
        document.getElementById('chat-box').classList.remove('hidden');
    }
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value.trim();
    if (messageText !== '') {
        const messages = document.getElementById('messages');
        const messageElement = document.createElement('div');
        messageElement.textContent = `${currentUser}: ${messageText}`;
        messages.appendChild(messageElement);
        messageInput.value = '';
        messageElement.scrollIntoView({ behavior: 'smooth' }); // Rola para a última mensagem
    }
}

function clearMessages() {
    const messages = document.getElementById('messages');
    messages.innerHTML = ''; // Limpa todas as mensagens
}

function changeTheme() {
    const themeSelector = document.getElementById('themeSelector');
    const selectedTheme = themeSelector.value;
    document.body.className = ''; // Remove todas as classes de tema
    document.body.classList.add(selectedTheme); // Adiciona a classe do tema selecionado
}

function changeBackground() {
    const backgroundInput = document.getElementById('backgroundInput');
    const file = backgroundInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.body.style.backgroundImage = `url(${e.target.result})`;
        };
        reader.readAsDataURL(file);
    }
}

// Adiciona evento de teclado ao campo de entrada de mensagem
document.getElementById('messageInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});