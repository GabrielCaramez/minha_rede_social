let currentUser = '';
let localStream;
let remoteStream;
let peerConnection;

const servers = {
    iceServers: [
        {
            urls: "stun:stun.l.google.com:19302"
        }
    ]
};

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
        messageElement.scrollIntoView({ behavior: 'smooth' });
    }
}

function clearMessages() {
    const messages = document.getElementById('messages');
    messages.innerHTML = '';
}

function changeTheme() {
    const themeSelector = document.getElementById('themeSelector');
    const selectedTheme = themeSelector.value;
    document.body.className = '';
    document.body.classList.add(selectedTheme);
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

function startVideoCall() {
    document.getElementById('video-call').classList.remove('hidden');
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            localStream = stream;
            document.getElementById('localVideo').srcObject = stream;

            peerConnection = new RTCPeerConnection(servers);
            peerConnection.addStream(localStream);

            peerConnection.onaddstream = event => {
                remoteStream = event.stream;
                document.getElementById('remoteVideo').srcObject = remoteStream;
            };

            peerConnection.onicecandidate = event => {
                if (event.candidate) {
                    // Send the candidate to the remote peer
                }
            };

            // Create an offer
            peerConnection.createOffer()
                .then(offer => {
                    peerConnection.setLocalDescription(offer);
                    // Send the offer to the remote peer
                });
        })
        .catch(error => {
            console.error('Error accessing media devices.', error);
        });
}

function endVideoCall() {
    peerConnection.close();
    localStream.getTracks().forEach(track => track.stop());
    document.getElementById('video-call').classList.add('hidden');
}

// Add event listener for Enter key in message input
document.getElementById('messageInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});