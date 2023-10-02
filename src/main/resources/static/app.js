import * as Ui from './lib/ui.js';
import * as ChannelId from './lib/channel.js';
import Hermes from './lib/client.js'
import {Status, getHost} from "./component/Config.js";


let client = null;

let status = Status.NOT_CONNECTED;

const initApplication = () => {
  console.log("Loading application");
  const clientHandlers = {
    receiveHandler: receive,
    disconnectHandler: disconnected,
    connectHandler: reconnected
  };

  const uiHandlers = {
    onConnectPublisher: () => connectPub(clientHandlers),
    onConnectSubscriber: (channelId) => connectSub(channelId, clientHandlers),
    onPublish: send,
    onDisconnect: disconnect
  };

  Ui.init()
      .then(() => console.log("Application loaded"))
      .then(() => Ui.setHandlers(uiHandlers));
};

const connectPub = (handlers) => {
  const channelId = ChannelId.generate();
  getHost()
      .then(host => {
        client = new Hermes(channelId, handlers, host);
        status = Status.CONNECTING;
      })
      .then(() => Ui.connecting())
      .then(() => client.connectPub())
      .then(() => {
        Ui.connected(channelId);
        status = Status.CONNECTED;
      })
  ;
};

const connectSub = (channelId, handlers) => {
  getHost()
      .then(host => {
        client = new Hermes(channelId, handlers, host);
        status = Status.CONNECTING;
      })
      .then(() => client.connectSub())
      .then(() => {
        Ui.connected(channelId);
        status = Status.CONNECTED;
      })
  ;
};

const send = (value) => {
  console.log("Sending data!!");
  client.send(value);
};

const receive = (value) => {
  console.log("Receiving data!!");
  Ui.setValue(value);
};

const disconnected = () => {
  console.log("Disconnected from: " + status);
  if (status === Status.CONNECTED) {
    status = Status.RECONNECTING;
    Ui.connecting();
  }
};

const disconnect = () => {
  status = Status.NOT_CONNECTED;
  if (client) {
    client.disconnect();
    client = null;
  }
};

const reconnected = () => {
  if (status === Status.RECONNECTING) {
    // only when we're reconnecting we use the handler
    Ui.connected();
    status = Status.CONNECTED;
  }
};

document.onreadystatechange = function () {
  if (document.readyState === "complete") {
    initApplication();
  }
};