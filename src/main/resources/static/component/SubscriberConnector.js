export default {
  emits: ['connectSubscriber', 'close'],
  data() {
    return {
      channelEntered: ""
    };
  },
  methods: {
    connect() {
      console.debug("Connecting subscriber to channel id: " + this.channelEntered);
      this.$emit('connectSubscriber', this.channelEntered)
    }
  },
  template: `
    <div id="subscriber-connector" class="fading centered-container">
      <div id="close-toolbar" class="absolute toolbar">
        <button id="close-button" class="command close" @click="this.$emit('close')"></button>
      </div>
      <form @submit.prevent="connect">
        <label for="subscriber-channel">Enter channel id</label>
        <input id="subscriber-channel" type="text" maxlength="5" pattern="[a-zA-Z]{5}" required v-model="channelEntered"/>
        <button id="subscriber-submit" class="action">Connect</button>
      </form>
    </div>
  `
}