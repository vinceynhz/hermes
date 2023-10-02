import './stomp.umd.min.js';

export default class Hermes {
  #channelId = undefined;
  #subscription = undefined;
  #stompClient = undefined;
  #connectHandler = () => {
  };
  #receiveHandler = () => {
  };
  #errorHandler = () => {
  };
  #disconnectHandler = () => {
  };

  constructor(channelId, handlers, host) {
    this.#channelId = channelId;

    this.#stompClient = new StompJs.Client({
      brokerURL: 'ws://' + host + '/broker'
    });

    if (handlers.hasOwnProperty('connectHandler')) {
      this.#connectHandler = handlers.connectHandler;
    } else {
      this.#connectHandler = console.log;
    }

    if (handlers.hasOwnProperty('receiveHandler')) {
      this.#receiveHandler = handlers.receiveHandler;
    } else {
      this.#receiveHandler = console.log;
    }

    if (handlers.hasOwnProperty('errorHandler')) {
      this.#errorHandler = handlers.errorHandler;
    } else {
      this.#errorHandler = console.error;
    }

    if (handlers.hasOwnProperty('disconnectHandler')) {
      this.#disconnectHandler = handlers.disconnectHandler;
    } else {
      this.#disconnectHandler = console.log;
    }

    this.#stompClient.onWebSocketError = (error) => {
      this.#errorHandler(error);
    };

    this.#stompClient.onStompError = (frame) => {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
      this.#errorHandler(frame.body);
    };

    this.#stompClient.onWebSocketClose = (event) => {
      this.#disconnectHandler(event);
    }
  }

  connectSub = () => new Promise((resolve) => {
    this.#stompClient.onConnect = (frame) => {
      console.debug('Connected: ' + frame);

      const sub = '/topic/sub/' + this.#channelId;
      console.debug("Subscription: " + sub);

      this.#subscription = this.#stompClient.subscribe(sub, this.#receive);
      this.#connectHandler();
      resolve();
    };
    this.#stompClient.activate();
  });

  connectPub = () => new Promise((resolve) => {
    this.#stompClient.onConnect = (frame) => {
      console.debug('Connected: ' + frame);
      this.#connectHandler();
      resolve();
    };
    this.#stompClient.activate();
  });

  disconnect = () => {
    if (this.#subscription) {
      this.#subscription.unsubscribe();
      this.#subscription = null;
    }
    if (this.#stompClient) {
      this.#stompClient.deactivate();
      this.#stompClient = null;
    }
  };

  send = (data) => {
    console.debug("Sending data");
    const body = {
      channel: this.#channelId,
      data
    };
    console.debug(body);
    this.#stompClient.publish({
      destination: "/app/pub",
      body: JSON.stringify(body)
    });
  };

  #receive = (message) => {
    console.debug("Message received " + message);
    const body = JSON.parse(message.body);
    console.debug(body);
    this.#receiveHandler(body.data);
  };
}
