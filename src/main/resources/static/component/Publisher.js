import '../lib/ace/ace.js';

import {Status, getEditor} from "./Config.js";
import {toast} from "../lib/fx.js";

export default {
  emits:['publish', 'close'],
  props: {
    channelId: String,
    status: String
  },
  data() {
    return {
      editor: null,
      headerClass: 'offline',
      title: 'Offline'
    }
  },
  watch: {
    status(newValue, oldValue) {
      if(newValue !== oldValue) {
        switch(newValue) {
          case Status.NOT_CONNECTED:
            this.headerClass = 'offline';
            this.title = 'Offline';
            this.editor.setOption("readOnly", true);
            break;
          case Status.CONNECTED:
            this.headerClass = 'online';
            this.title = 'Publishing in channel: ' + this.channelId;
            this.editor.setOption("readOnly", false);
            break;
          case Status.CONNECTING:
            this.headerClass = 'connecting';
            this.title = 'Connecting...';
            this.editor.setOption("readOnly", true);
            break;
          default:
            this.headerClass = 'error';
            this.title = 'Error!';
            this.editor.setOption("readOnly", true);
        }
      }
    }
  },
  mounted() {
    this.editor = getEditor("editor");
  },
  methods: {
    publish() {
      toast("pop");
      this.$emit('publish', this.editor.getValue());
    }
  },
  template: `
    <div id="publisher" class="fading centered-container">
      <div id="close-toolbar" class="absolute toolbar">
        <button id="close-button" class="command close" @click="this.$emit('close')"></button>
      </div>
      <h1 :class="headerClass">{{title}}</h1>
      <div id="editor"></div>
      <div id="toolbar" class="toolbar">
        <span id="pop" class="toast fading">Sent!</span>
        <button class="command send" @click="publish"></button>
      </div>
    </div>
  `
}