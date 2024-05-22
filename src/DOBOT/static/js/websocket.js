export default class WebSocketHandler {
    url;

    /**
     * @type Websocket
     */
    ws;

    /**
     * 
     * @param {{
     *      onMessage: (e: MessageEvent) => void;
     *      onError: (e: ErrorEvent) => void; 
     * }} options 
     */
    constructor(options) {
        this.url = options.url;

        this.onMessage = options.onMessage;
        this.onError = options.onError;

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
            this.onError()
        };
    }

    addCustomMethodes() {
        this.ws.onmessage = this.onMessage; 
    }
}

