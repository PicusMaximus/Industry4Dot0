import { addEmergencyStopBtn } from '../actions'

addEmergencyStopBtn();

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