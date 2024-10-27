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

// Placeholder for signaling server connection
let signalingServer = new WebSocket('wss://your-signaling-server-url');

signalingServer.onmessage = async (message) => {
    const data = JSON.parse(message.data);

    if (data.type === 'offer') {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        signalingServer.send(JSON.stringify({ type: 'answer', answer: answer }));
    } else if (data.type === 'answer') {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
    } else if (data.type === 'candidate') {
        await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
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
                    signalingServer.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }));
                }
            };

            // Create an offer
            peerConnection.createOffer()
                .then(offer => {
                    peerConnection.setLocalDescription(offer);
                    signalingServer.send(JSON.stringify({ type: 'offer', offer: offer }));
                });
        })
        .catch(error => {
            console.error('Error accessing media devices.', error);
        });
}

function endVideoCall() {
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }
    document.getElementById('localVideo').srcObject = null;
    document.getElementById('remoteVideo').srcObject = null;
    document.getElementById('video-call').classList.add('hidden');
}

// Add event listener for Enter key in message input
document.getElementById('messageInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});