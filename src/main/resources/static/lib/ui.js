import {createApp} from './vue.esm-browser.js';
import {transition, throttle} from "./fx.js";

import Root from '../component/RootComponent.js';

import {Status} from '../component/Config.js';

let root;

export const init = () => {
  root = createApp(Root).mount('#app');

  return transition('preload', 'app', () => {
    document.getElementById('preload').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
  }).then(() => console.log("UI loaded"));
};

export const setHandlers = (handlers) => {
  root.setHandlers(handlers);
};

export const connecting = () => throttle(() => root.setStatus(Status.CONNECTING));

export const connected = (channelId) => throttle(() => {
  root.setStatus(Status.CONNECTED, channelId)
});

export const disconnect = () => throttle(()=> {
  root.setStatus(Status.NOT_CONNECTED);
});

export const error = () => throttle(() => root.setStatus(Status.ERROR));

export const setValue = (value) => {
  root.setValue(value);
};