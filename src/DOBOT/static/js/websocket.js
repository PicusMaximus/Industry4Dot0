export default class WebSocketHandler {
    url = '';
    ws = null;

    constructor(options) {
        this.url = options.url;

        this.onMessage = options.onMessage;

        this.ws = this.createWs();
        this.addStandardWsMethodes()
        this.addCustomMethodes();
    }

    createWs() {
        return new WebSocket(this.url);
    }

    addStandardWsMethodes() {
        this.ws.onopen = () => {
            console.log('Connected to the websocket.')
        };
    
        this.ws.onclose = (e) => {
            // connection closed, discard old websocket and create a new one in 5s
            if (e.wasClean) {
                console.log(`[close] Connection closed cleanly, code=${e.code} reason=${e.reason}`);
            } else {
                console.log('[close] Connection died');
            }
    
            this.ws = null;
    
            setTimeout(() => {
                this.ws = this.createWs();
                this.addStandardWsMethodes()
                this.addCustomMethodes();
            }, 5000);
        }
    
        this.ws.onerror = (error) => {
            console.error(error.message);
        };
    }

    addCustomMethodes() {
        this.ws.onmessage = this.onMessage; 
    }
}

