import { addEmergencyStopBtn } from "../actions";
import { showToast } from "../toast";
import WebSocketHandler from "../websocket.js";
import { onError, onMessage } from '../ws-events.js';


fetch('/api/device/settings', { method: 'GET' }).then(async (res) => {
    const json = await res.json();

    const settingLeitstelle = document.getElementById('settings-leitstelle-adresse');
    const settingDobotName = document.getElementById('settings-dobot-name');

    settingLeitstelle.value = json.monitorIp;
    settingDobotName.value = json.deviceName;
});


const wsHandler = new WebSocketHandler({
    url: `ws://${window.location.hostname}:8080/ws`,
    onMessage: onMessage,
    onError: onError,
});

addEmergencyStopBtn();

document.getElementById('login-monitor-btn').addEventListener('click', async () => {
    const settingLeitstelle = document.getElementById('settings-leitstelle-adresse');
    const settingDobotName = document.getElementById('settings-dobot-name');

    if (!settingLeitstelle || !settingDobotName) throw new Error('The current settings could not be saved...');
    
        const res = await fetch(`/api/device/settings?monitorIP=${settingLeitstelle.value}&deviceName=${settingDobotName.value}`, { method: 'POST' });
        if(res.status.toString().startsWith(4) || res.status.toString().startsWith(5)) {
            showToast('The current settings could not be saved.', 'danger');
            return;
        }
        showToast('The settings were successfully saved.', 'success');
});