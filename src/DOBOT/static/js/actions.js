export function addEmergencyStopBtn() {
    document.getElementById('emergency-stop--btn')?.addEventListener('click', async () => {
        // Does currently not work... idky yet but api endpoint seems to work fine for now...
        // ws.send(JSON.stringify({ type: 'control-command', command: 'emergency_stop' }));
        await fetch('/api/device/notstop', {method: 'DELETE'});
        await fetch('/api/device/start', {method: 'POST'});
    });
}

export function addHomeBtn() {
    document.getElementById('home--btn')?.addEventListener('click', async () => {
        await fetch('/api/device/home', {method: 'POST'});
    });
}