import { showToast } from "./toast.js";

/**
 * 
 * @param {MessageEvent} e 
 */
export function onMessage(e) {
    const data = JSON.parse(e.data)

    if (data.type === 'disconnected') {
        const dobotConnection = document.getElementById('dobot-connection');
        dobotConnection.classList.remove('text-green-500', 'hover:text-green-600', 'focus:outline-none', 'focus:text-green-700');
        dobotConnection.classList.add('text-red-500', 'hover:text-red-600', 'focus:outline-none', 'focus:text-red-700')

        showToast('Die Verbindung zum DoBot konnte nicht hergestellt werden.', 'danger');
    }

    if (data.type === 'connected') {
        const dobotConnection = document.getElementById('dobot-connection');
        dobotConnection.classList.remove('text-red-500', 'hover:text-red-600', 'focus:outline-none', 'focus:text-red-700');
        dobotConnection.classList.add('text-green-500', 'hover:text-green-600', 'focus:outline-none', 'focus:text-green-700');

        showToast('Die Verbindung zum DoBot wurde hergestellt.', 'success');
    }
}

/**
 * 
 * @param {ErrorEvent} e 
 */
export function onError(e) {
    const dobotConnection = document.getElementById('dobot-connection');
    dobotConnection.classList.remove('text-green-500', 'hover:text-green-600', 'focus:outline-none', 'focus:text-green-700');
    dobotConnection.classList.add('text-red-500', 'hover:text-red-600', 'focus:outline-none', 'focus:text-red-700')

    showToast('Die Verbindung zum Websocket-Server konnte nicht hergestellt werden.', 'danger');
}