let ws

let openNotConnected = false;

$('.btn-jog-operation').on('click', (e) => {
    e.preventDefault();

    if (!ws || ws.readyState !== WebSocket.OPEN) throw new Error('The client could not connected to the socket.');

    const d = {
        type: 'control-command',
        command: 'move',
        mode: e.currentTarget.getAttribute('data-mode') || 'XYZ',
        direction: e.currentTarget.id || 'xn',
        steps: 15,
    };

    ws.send(JSON.stringify(d));
    return;
});

// keypress actions
$(document).on('keypress', (e) => {
    // XYZR
    if (e.code == 'KeyW') return $('#yn').click(), void 0;
    if (e.code == 'KeyS') return $('#yp').click(), void 0;
    if (e.code == 'KeyA') return $('#xp').click(), void 0;
    if (e.code == 'KeyD') return $('#xn').click(), void 0;

    if (e.code == 'KeyR') return $('#zp').click(), void 0;
    if (e.code == 'KeyF') return $('#zn').click(), void 0;
    if (e.code == 'KeyQ') return $('#rn').click(), void 0;
    if (e.code == 'KeyE') return $('#rp').click(), void 0;
    // Joints
    if (e.code == 'KeyI') return $('#j1n').click(), void 0;
    if (e.code == 'KeyK') return $('#j1p').click(), void 0;
    if (e.code == 'KeyJ') return $('#j2p').click(), void 0;
    if (e.code == 'KeyL') return $('#j2n').click(), void 0;

    if (e.code == 'KeyP') return $('#j3n').click(), void 0;
    if (e.code == 'Semicolon') return $('#j3p').click(), void 0;
    if (e.code == 'KeyU') return $('#j4n').click(), void 0;
    if (e.code == 'KeyO') return $('#j4p').click(), void 0;
})

function startWebsocket() {
    ws = new WebSocket(`ws://${window.location.hostname}:8080/ws`)

    ws.onopen = () => {
        openNotConnected = true;
    };

    ws.onmessage = (e) => {
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
            // showToast('The Dobot disconnected from the Pi, please check the connection', 'success');

            // bg-green-500 hover:bg-green-600 text-green-100 hover:text-green-200 focus:outline-none focus:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700
        }

        if (data.type === 'pose') {
            const elemX = document.getElementById('dobot-arm-pos-x');
            const elemY = document.getElementById('dobot-arm-pos-y');
            const elemZ = document.getElementById('dobot-arm-pos-z');
            const elemR = document.getElementById('dobot-arm-pos-r');
            const elemJ1 = document.getElementById('dobot-arm-pos-j1');
            const elemJ2 = document.getElementById('dobot-arm-pos-j2');
            const elemJ3 = document.getElementById('dobot-arm-pos-j3');
            const elemJ4 = document.getElementById('dobot-arm-pos-j4');


            if(!elemX || !elemY || !elemZ || !elemR || !elemJ1 || !elemJ2 || !elemJ3 || !elemJ4) return;

            elemX.value = data.data.x;
            elemY.value = data.data.y;
            elemZ.value = data.data.z;
            elemR.value = data.data.r;
            elemJ1.value = data.data.j1;
            elemJ2.value = data.data.j2;
            elemJ3.value = data.data.j3;
            elemJ4.value = data.data.j4;

            return;
        }
    };

    ws.onclose = (e) =>{
        // connection closed, discard old websocket and create a new one in 5s
        if (e.wasClean) {
            console.log(`[close] Connection closed cleanly, code=${e.code} reason=${e.reason}`);
        } else {
            console.log('[close] Connection died');
        }
        ws = null;
        setTimeout(startWebsocket, 5000);
    }

    ws.onerror = (error) => {
        console.error(`[error] ${error.message}`);
    };
}

document.getElementById('free-drive-btn')?.addEventListener('click', async () => {
    ws.send(JSON.stringify({ type: 'control-command', command: 'home' }));
});

document.getElementById('emergency-stop--btn')?.addEventListener('click', async () => {
    // Does currently not work... idky yet but api endpoint seems to work fine for now...
    // ws.send(JSON.stringify({ type: 'control-command', command: 'emergency_stop' }));
    await fetch('/api/device/notstop', {method: 'DELETE'});
    await fetch('/api/device/start', {method: 'POST'});
});

startWebsocket()
