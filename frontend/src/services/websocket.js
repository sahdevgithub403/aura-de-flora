import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080/ws-restaurant';

class WebSocketService {
    constructor() {
        this.client = null;
        this.subscriptions = new Map();
    }

    connect() {
        if (this.client && this.client.connected) return;

        const token = localStorage.getItem('token');
        const socket = new SockJS(WS_URL);
        
        this.client = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                Authorization: `Bearer ${token}`
            },
            debug: (str) => {
                // console.log(str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        this.client.onConnect = (frame) => {
            console.log('Connected to WebSocket');
            this.subscriptions.forEach((callbacks, topic) => {
                this._subscribeToTopic(topic);
            });
        };

        this.client.activate();
    }

    _subscribeToTopic(topic) {
        if (!this.client || !this.client.connected) return;
        
        this.client.subscribe(topic, (message) => {
            const data = JSON.parse(message.body);
            const callbacks = this.subscriptions.get(topic);
            if (callbacks) {
                callbacks.forEach(callback => callback(data));
            }
        });
    }

    subscribe(topic, callback) {
        if (!this.subscriptions.has(topic)) {
            this.subscriptions.set(topic, new Set());
            if (this.client && this.client.connected) {
                this._subscribeToTopic(topic);
            }
        }
        this.subscriptions.get(topic).add(callback);
        return () => {
            const callbacks = this.subscriptions.get(topic);
            if (callbacks) callbacks.delete(callback);
        };
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate();
            this.client = null;
        }
        this.subscriptions.clear();
    }
}

const instance = new WebSocketService();
export default instance;
