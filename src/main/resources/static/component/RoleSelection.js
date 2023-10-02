import {Roles, getHost, setHost} from './Config.js';
import {fadeIn, fadeOut, throttle} from "../lib/fx.js";

export default {
  emits: ['roleSelected'],
  data() {
    return {
      settingsVisible: false,
      host: ''
    }
  },
  mounted() {
    getHost().then((value) => {
      this.host = value;
    });
  },
  methods: {
    select(event) {
      switch (event.target.id) {
        case "role-pub":
          this.$emit('roleSelected', Roles.PUB);
          break;
        case "role-sub":
          this.$emit('roleSelected', Roles.SUBCON);
          break;
        default:
          break;
      }
    },
    onSettings() {
      const el = document.getElementById("settings");
      const button = document.getElementById("settings-button");
      if (this.settingsVisible) {
        setHost(this.host)
            .then(() => throttle(() => {
              button.classList.remove("save");
              button.classList.add("settings");
            }))
            .then(() => fadeOut("settings"))
            .then(() => el.classList.add("hidden"))
            .then(() => {
              this.settingsVisible = !this.settingsVisible
            });
      } else {
        throttle(() => {
          el.classList.remove("hidden");
          button.classList.add("save");
          button.classList.remove("settings");
        })
            .then(() => fadeIn("settings"))
            .then(() => {
              this.settingsVisible = !this.settingsVisible
            });
      }
    }
  },
  template: `
    <div id="role-selection" class="centered-container">
      <div id="toolbar" class="absolute toolbar">
        <div id="settings" class="hidden fading">
          <label for="host">Host:</label>
          <input id="host" type="text" v-model="host"/>
        </div>
        <button id="settings-button" class="command settings" @click="onSettings"></button>
      </div>
      <h1>Connect as...</h1>
      <div id="button-box">
        <button id="role-pub" class="action" @click="select">Publisher</button>
        <button id="role-sub" class="action" @click="select">Subscriber</button>
      </div>
    </div>
  `
}