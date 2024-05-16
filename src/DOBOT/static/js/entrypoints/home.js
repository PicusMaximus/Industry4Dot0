import { addEmergencyStopBtn } from '../actions'
import { addHomeBtn } from '../actions'
import { showToast } from '../toast.js';
import WebSocketHandler from "../websocket.js";

addEmergencyStopBtn();
addHomeBtn();

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

// RUN TASK
$(document).on('click', async (e) => {
    const task = e.target.closest('.run-task-btn');

    if (!task) return;

    const taskContainer = task.closest('.task');
    const taskId = taskContainer.getAttribute('data-task-id');

    if (!taskId) return;

    await fetch(`/api/device/task?id=${taskId}`, { method: 'POST' })
});

// EDIT TASK
$(document).on('click', (e) => {
    const task = e.target.closest('.edit-task-btn');

    if (!task) return;

    const taskContainer = task.closest('.task');
    const taskId = taskContainer.getAttribute('data-task-id');

    if (!taskId) return;

    window.location.href = `/task?id=${taskId}`
});

// DELETE TASK
$(document).on('click', async (e) => {
    const task = e.target.closest('.delete-task-btn');

    if (!task) return;

    const taskContainer = task.closest('.task');
    const taskId = taskContainer.getAttribute('data-task-id');

    if (!taskId) return;

    await fetch(`/api/task?id=${taskId}`, { method: 'DELETE' })

    taskContainer.remove();
});

// Dialog stuff

$('task-name-dialog').on('click', (e) => {
    if (!e.target.closest('#free-drive-btn')) return;
    const dialog = document.getElementById('movement-dialog');
    dialog.showModal();
    dialog.classList.remove('hidden');

    document.getElementById('task-name-dialog').addEventListener("close", () => {
        dialog.classList.add('hidden');
    }, {once: true});
})

$(document).on('click', (e) => {
    if (e.target.classList.contains('close-dialog-btn')) {
        e.target.closest('dialog').close();
        return;
    }

    if (e.target.closest('.close-dialog-btn')) {
        e.target.closest('dialog').close();
        return;
    }

    if (e.target.closest('button')?.id === 'save-position-btn') {
        wsHandler.ws.send(JSON.stringify({type: 'control-command', command: 'pose'}))
        e.target.closest('dialog').close();
        return;
    }
}); 