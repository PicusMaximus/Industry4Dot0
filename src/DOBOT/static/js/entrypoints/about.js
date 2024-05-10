import { addEmergencyStopBtn } from '../actions'
import WebSocketHandler from "../websocket.js";

addEmergencyStopBtn();

function onMessage(e) {
    const data = JSON.parse(e.data)

    if (data.type === 'disconnected') {
        const dobotConnection = document.getElementById('dobot-connection');
        dobotConnection.className = '';
        dobotConnection.classList.add('text-red-500', 'hover:text-red-600', 'focus:outline-none', 'focus:text-red-700')

        showToast('The Dobot disconnected from the Pi, please check the connection', 'danger');
    }

    if (data.type === 'connected') {
        const dobotConnection = document.getElementById('dobot-connection');
        dobotConnection.className = '';
        dobotConnection.classList.add('text-green-500', 'hover:text-green-600', 'focus:outline-none', 'focus:text-green-700');
    }
}

const wsHandler = new WebSocketHandler({
    url: `ws://${window.location.hostname}:8080/ws`,
    onMessage: onMessage,
});