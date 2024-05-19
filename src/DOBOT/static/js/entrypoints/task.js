import WebSocketHandler from "../websocket.js";
import TaskManager from "../task-manager.js";
import { initPanelSectionSlider } from "../panel.js";
import { addEmergencyStopBtn } from '../actions.js'
import { onError, onMessage } from '../ws-events.js';

addEmergencyStopBtn();

function onMessageCustom(e) {
    const data = JSON.parse(e.data)

    onMessage(e);

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

        $(elemX).trigger('change')
        $(elemY).trigger('change')
        $(elemZ).trigger('change')
        $(elemR).trigger('change')
        $(elemJ1).trigger('change')
        $(elemJ2).trigger('change')
        $(elemJ3).trigger('change')
        $(elemJ4).trigger('change')

        return;
    }
}

const wsHandler = new WebSocketHandler({
    url: `ws://${window.location.hostname}:8080/ws`,
    onMessage: onMessageCustom,
    onError: onError,
});

initPanelSectionSlider();

new TaskManager();

$(document).on('click', (e) => {
    if (!e.target.closest('#free-drive-btn')) return;
    const dialog = document.getElementById('movement-dialog');
    dialog.showModal();
    dialog.classList.remove('hidden');
    addKeyBoardSupport()

    $('.btn-jog-operation').on('click', (e) => {
        e.preventDefault();
    
        if (!wsHandler.ws || wsHandler.ws.readyState !== WebSocket.OPEN) throw new Error('The client could not connected to the socket.');
    
        const d = {
            type: 'control-command',
            command: 'move',
            mode: e.currentTarget.getAttribute('data-mode') || 'XYZ',
            direction: e.currentTarget.id || 'xn',
            steps: 15,
        };
    
        wsHandler.ws.send(JSON.stringify(d));
        return;
    });

    $(document.getElementById('home-point--btn')).on('click', async () => {
        wsHandler.ws.send(JSON.stringify({ type: 'control-command', command: 'home' }));
    });

    document.getElementById('movement-dialog').addEventListener("close", () => {
        $(document).off('keypress');
        $('.btn-jog-operation').off('click');
        $(document.getElementById('home-point--btn')).off();
        dialog.classList.add('hidden');
    }, {once: true});
})

function addKeyBoardSupport() {
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
}

// Dialog stuff
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
