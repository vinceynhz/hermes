import {getEditor, Status} from "./Config.js";
import "../lib/marked.min.js";
import {toast} from "../lib/fx.js";

export default {
  emits: ['close'],
  props: {
    channelId: String,
    status: String
  },
  data() {
    return {
      editor: null,
      headerClass: 'offline',
      title: 'Offline',
      renderValue: ""
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
            this.title = 'Subscribed to channel: ' + this.channelId;
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
    this.editor.session.on('change', () => {
      this.renderValue = this.editor.getValue();
    });
  },
  expose: ['setValue'],
  methods: {
    setValue(value) {
      this.editor.setValue(value);
    },
    copy() {
      const el = document.getElementById("render");

      let range = document.getRangeAt();
      range.selectNode(el);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      try {
        document.execCommand("copy");
        window.getSelection().removeAllRanges();
        toast("pop");
      } catch (err) {
        console.error("Unable to copy");
        console.error("Error")
      }

    }
  },
  computed: {
    renderedValue() {
      return marked.parse(this.renderValue);
    }
  },
  template: `
    <div id="subscriber" class="fading centered-container">
      <div id="close-toolbar" class="absolute toolbar">
        <button id="close-button" class="command close" @click="this.$emit('close')"></button>
      </div>
      <h1 :class="headerClass">{{title}}</h1>
      <div id="toolbar" class="toolbar">
        <span id="pop" class="toast fading">Copied!</span>
        <button class="command copy" @click="copy"></button>
      </div>
      <div id="sub-container">
        <div id="editor"></div>
        <div id="render" v-html="renderedValue"></div>
      </div>
    </div>
  `
}