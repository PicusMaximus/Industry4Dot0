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
            const elem = document.getElementById('current-position');
            if (!elem) return;
    
            const $elem = $(elem);
            $elem.empty();
            $elem.append($(`<span class="text-gray-800 dark:text-white" ></span>`).text(`X: ${data.data.x.toFixed(3)}, Y: ${data.data.y.toFixed(3)}, Z: ${data.data.z.toFixed(3)}, R: ${data.data.r.toFixed(3)}`));
            $elem.append($(`<span class="text-gray-800 dark:text-white"></span>`).text(`J1: ${data.data.j1.toFixed(3)}, J2: ${data.data.j2.toFixed(3)}, J3: ${data.data.j3.toFixed(3)}, J4: ${data.data.j4.toFixed(3)}`));
            
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

document.getElementById('free-drive-btn').addEventListener('click', async () => {
    await fetch('/api/device/home', {method: 'POST'})
});

startWebsocket()
