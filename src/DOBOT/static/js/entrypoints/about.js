import { addEmergencyStopBtn } from '../actions'
import WebSocketHandler from "../websocket.js";
import { onError, onMessage } from '../ws-events.js';

addEmergencyStopBtn();

new WebSocketHandler({
    url: `ws://${window.location.hostname}:8080/ws`,
    onMessage: onMessage,
    onError: onError
});