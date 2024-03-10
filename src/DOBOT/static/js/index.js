let ws

$('#connect-btn').on('click', (e) => {
    e.preventDefault();
    $('.btn').prop("disabled",true);
    $('#connecting').removeClass('d-none');

    const d = {
        type: 'control-command',
        command: 'connect',
        port: $('#port').val(),
    }

    for (const f in e.currentTarget.dataset) {
        d[f] = e.currentTarget.dataset[f];
    }

    if (e.currentTarget.dataset['useWs'] && ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(d))
        return;
    }

    $.get('/controls/connect', d, (data) => {
        console.log(data);
        $('#connecting').addClass('d-none');
        $('.btn').prop("disabled",false);
    })
})

$('#disconnect-btn').on('click', (e) => {
    e.preventDefault();

    $('.btn').prop("disabled",true);
    $('#disconnecting').removeClass('d-none');

    const d = {
        type: 'control-command',
        command: 'disconnect',
    }

    for (const f in e.currentTarget.dataset) {
        d[f] = e.currentTarget.dataset[f]
    }

    if (e.currentTarget.dataset['useWs'] && ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(d))
        return;
    }

    $.get('/controls/disconnect', d, (data) => {
        console.log(data)
        $('#disconnecting').addClass('d-none')
        $('.btn').prop("disabled",false)
    })
})

$('.btn-operation').on('click', (e) => {
    e.preventDefault()
    const d = { type: 'command' }

    for (const f in e.currentTarget.dataset) {
        d[f] = e.currentTarget.dataset[f]
    }

    if (e.currentTarget.dataset['useWs'] && ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(d))
        return;
    }

    $.get(e.currentTarget.dataset['url'], d, (data) => {
        console.log(data)
    })
})

$('.btn-jog-operation').on('click', (e) => {
    e.preventDefault()

    const d = {
        type: 'control-command',
        command: 'jog',
        steps: $('#steps').val()
    }

    for (const f in e.currentTarget.dataset) {
        d[f] = e.currentTarget.dataset[f]
    }

    // console.log(d)

    if (e.currentTarget.dataset['useWs'] && ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(d))
        return;
    }

    $.get(e.currentTarget.dataset['url'], d, (data) => {
        console.log(data)
    })
})

$('#set-speed').on('click', (e) => {
    e.preventDefault()

    const d = {
        type: 'control-command',
        command: 'set-speed',
        velocity: $('#velocity').val(),
        acceleration: $('#acceleration').val()
    }

    for (const f in e.currentTarget.dataset) {
        d[f] = e.currentTarget.dataset[f]
    }

    if (e.currentTarget.dataset['useWs'] && ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(d));
        return;
    }

    $.get(e.currentTarget.dataset['url'], d, data => {
        console.log(data)
    })
})

// keypress actions
$(document).on('keypress', (e) => {
    enabled = $('#hotkeys').is(':checked')
    // console.log(enabled)
    // console.log(e.code)

    if (!enabled) return

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
    ws = new WebSocket(`ws://${window.location.host}/ws`)

    ws.onopen = () => {
        console.log("[open] Connection established");
    };

    ws.onmessage = (e) => {
        const data = JSON.parse(e.data)
        if (data.type !== 'update') return;

        const selectedPort = $('#port').find(":selected").text()
        let portOptions = ''
        for (const p in data.ports) {
            if (data.ports[p] === selectedPort) {
                portOptions += `<option value="${data.ports[p].value}" selected>${data.ports[p].name}</option>`;
                continue;
            }

            portOptions += `<option value="${data.ports[p].value}">${data.ports[p].name}</option>`;
        }

        $('#port').html(portOptions)

        if (data.status === 'connected') {
            $('.show-disconnected').addClass('d-none');
            $('.show-connected').removeClass('d-none');
            $('#connecting').addClass('d-none');
            $('.btn').prop("disabled",false);
            $('#currpe').html(`X: ${data.position.x.toFixed(3)}, Y: ${data.position.y.toFixed(3)}, Z: ${data.position.z.toFixed(3)}, R: ${data.position.r.toFixed(3)}<br>J1: ${data.position.j1.toFixed(3)}, J2: ${data.position.j2.toFixed(3)}, J3: ${data.position.j3.toFixed(3)}, J4: ${data.position.j4.toFixed(3)}`);
            
            return;
        }
        
        if (data.status === 'disconnected') {
            $('.show-connected').addClass('d-none');
            $('.show-disconnected').removeClass('d-none');
            $('#disconnecting').addClass('d-none');
            $('.btn').prop("disabled",false);
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
        console.log(`[error] ${error.message}`);
    };
}

startWebsocket()
