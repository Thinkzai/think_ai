const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:3000/ws";

class WebSocketService {
  constructor() {
    this.ws = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.sessionId = null;
    this.userId = null;
    this.token = null;
  }

  connect(sessionId, userId, token) {
    this.sessionId = sessionId;
    this.userId = userId;
    this.token = token;

    const url = `${WS_URL}?sessionId=${sessionId}&userId=${userId}&token=${token}`;

    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.emit("connected", { sessionId, userId });
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.emit(data.type, data.payload);
      } catch {
        this.emit("error", { message: "Invalid message format" });
      }
    };

    this.ws.onclose = (event) => {
      this.emit("disconnected", { code: event.code, reason: event.reason });

      if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
        setTimeout(() => this.connect(sessionId, userId, token), delay);
      }
    };

    this.ws.onerror = () => {
      this.emit("error", { message: "WebSocket connection error" });
    };
  }

  disconnect() {
    if (this.ws) {
      this.ws.close(1000, "User disconnected");
      this.ws = null;
    }
    this.reconnectAttempts = this.maxReconnectAttempts;
  }

  send(type, payload) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    }
  }

  sendMessage(content) {
    this.send("chat:message", {
      content,
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: new Date().toISOString(),
    });
  }

  sendPollVote(pollId, optionIndex) {
    this.send("poll:vote", {
      pollId,
      optionIndex,
      sessionId: this.sessionId,
      userId: this.userId,
    });
  }

  sendTypingIndicator() {
    this.send("chat:typing", {
      sessionId: this.sessionId,
      userId: this.userId,
    });
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach((callback) => callback(data));
    }
  }

  get isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;
