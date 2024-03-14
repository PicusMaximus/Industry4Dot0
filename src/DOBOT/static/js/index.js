let ws

let openNotConnected = false;

let moveCooldown = false;

// $('#connect-btn').on('click', (e) => {
//     e.preventDefault();
//     $('.btn').prop("disabled",true);
//     $('#connecting').removeClass('d-none');

//     const d = {
//         type: 'control-command',
//         command: 'connect',
//         port: $('#port').val(),
//     }

//     for (const f in e.currentTarget.dataset) {
//         d[f] = e.currentTarget.dataset[f];
//     }

//     if (e.currentTarget.dataset['useWs'] && ws && ws.readyState === WebSocket.OPEN) {
//         ws.send(JSON.stringify(d))
//         return;
//     }

//     $.get('/controls/connect', d, (data) => {
//         console.log(data);
//         $('#connecting').addClass('d-none');
//         $('.btn').prop("disabled",false);
//     })
// })


// $('.btn-operation').on('click', (e) => {
//     e.preventDefault()
//     const d = { type: 'command' }

//     for (const f in e.currentTarget.dataset) {
//         d[f] = e.currentTarget.dataset[f]
//     }

//     if (e.currentTarget.dataset['useWs'] && ws && ws.readyState === WebSocket.OPEN) {
//         ws.send(JSON.stringify(d))
//         return;
//     }

//     $.get(e.currentTarget.dataset['url'], d, (data) => {
//         console.log(data)
//     })
// })

$('.btn-jog-operation').on('click', async (e) => {
    if (moveCooldown) return;

    e.preventDefault()
    const d = {
        type: 'control-command',
        command: 'jog',
        steps: 10
    }

    for (const f in e.currentTarget.dataset) {
        d[f] = e.currentTarget.dataset[f]
    }

    // console.log(d)
    //e.currentTarget.dataset['useWs'] && 

    // if (ws && ws.readyState === WebSocket.OPEN) {
    //     ws.send(JSON.stringify(d))
    //     return;
    // }

    // $.get(e.currentTarget.dataset['url'], d, (data) => {
    //     console.log(data)
    // })
    moveCooldown = true
    await fetch(`/api/device/move-step?mode=${e.currentTarget.getAttribute('data-mode')}&direction=${e.currentTarget.id}`, {method: 'POST'})
    moveCooldown = false;
})

// $('#set-speed').on('click', (e) => {
//     e.preventDefault()

//     const d = {
//         type: 'control-command',
//         command: 'set-speed',
//         velocity: $('#velocity').val(),
//         acceleration: $('#acceleration').val()
//     }

//     for (const f in e.currentTarget.dataset) {
//         d[f] = e.currentTarget.dataset[f]
//     }

//     if (e.currentTarget.dataset['useWs'] && ws && ws.readyState === WebSocket.OPEN) {
//         ws.send(JSON.stringify(d));
//         return;
//     }

//     $.get(e.currentTarget.dataset['url'], d, data => {
//         console.log(data)
//     })
// })

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
    const wsURL = document.getElementById('ws-url-ip').getAttribute('data-ws-url');

    ws = new WebSocket(`ws://${window.location.hostname}:8080/ws`)

    ws.onopen = (e) => {
        console.log("[open] Connection established");
        openNotConnected = true;
    };

    ws.onmessage = (e) => {
        const data = JSON.parse(e.data)
        if (data.type !== 'update') return;

        // const selectedPort = $('#port').find(":selected").text()
        // let portOptions = ''
        // for (const p in data.ports) {
        //     if (data.ports[p] === selectedPort) {
        //         portOptions += `<option value="${data.ports[p].value}" selected>${data.ports[p].name}</option>`;
        //         continue;
        //     }

        //     portOptions += `<option value="${data.ports[p].value}">${data.ports[p].name}</option>`;
        // }

        // $('#port').html(portOptions)

        if (data.status === 'disconnected')
        showToast('The Dobot disconnected from the Pi, please check the connection', 'danger')


        if (openNotConnected && data.status === 'disconnected') {
            const dd = {
                type: 'control-command',
                command: 'connect',
                port: data.ports[0].name,
            }
        
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(dd))
                openNotConnected = false;
                return;
            }
        }

        if (data.status === 'connected') {
            const elem = document.getElementById('current-position');

            if (!elem) return;

            $(elem).text(`X: ${data.position.x.toFixed(3)}, Y: ${data.position.y.toFixed(3)}, Z: ${data.position.z.toFixed(3)}, R: ${data.position.r.toFixed(3)}<br>J1: ${data.position.j1.toFixed(3)}, J2: ${data.position.j2.toFixed(3)}, J3: ${data.position.j3.toFixed(3)}, J4: ${data.position.j4.toFixed(3)}`);

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
