import {Roles, Status} from './Config.js';
import {transition} from "../lib/fx.js";

import RoleSelection from './RoleSelection.js';
import Publisher from './Publisher.js';
import SubscriberConnector from './SubscriberConnector.js';
import Subscriber from './Subscriber.js';

export default {
  data() {
    return {
      role: Roles.UNDEFINED,
      status: Status.NOT_CONNECTED,
      channelId: null,
      onConnectSubscriber: () => {},
      onConnectPublisher: () => {},
      onPublish: () => {},
      onDisconnect: () => {}
    }
  },
  expose: ['setHandlers', 'setStatus', 'setValue'],
  methods: {
    setValue(value) {
      this.$refs.valueConsumer.setValue(value);
    },
    setHandlers(handlers) {
      if (handlers.hasOwnProperty('onConnectPublisher')) {
        this.onConnectPublisher = handlers.onConnectPublisher;
      }
      if (handlers.hasOwnProperty('onConnectSubscriber')) {
        this.onConnectSubscriber = handlers.onConnectSubscriber;
      }
      if (handlers.hasOwnProperty('onPublish')) {
        this.onPublish = handlers.onPublish;
      }
      if (handlers.hasOwnProperty('onDisconnect')) {
        this.onDisconnect = handlers.onDisconnect;
      }
    },
    setStatus(status, channelId) {
      this.status = status;
      if (channelId && channelId !== this.channelId) {
        this.channelId = channelId;
      }
    },
    selectRole(newRole) {
      console.debug(this.role);
      console.debug(newRole);
      transition(this.role.id, newRole.id, () => this.role = newRole)
          .then(() => this.connectPublisher());
    },
    connectSubscriber(channelId) {
      transition(this.role.id, Roles.SUB.id, () => this.role = Roles.SUB)
          .then(() => this.onConnectSubscriber(channelId));
    },
    connectPublisher() {
      if (this.role.value === Roles.PUB.value) {
        this.onConnectPublisher();
      }
    },
    publish(value) {
      this.onPublish(value);
    },
    close() {
      this.channelId = null;
      this.onDisconnect();
      this.selectRole(Roles.UNDEFINED);
    }
  },
  components: {
    RoleSelection,
    Publisher,
    SubscriberConnector,
    Subscriber
  },
  computed: {
    isUndefined() {
      return this.role.value === Roles.UNDEFINED.value;
    },
    isPub() {
      return this.role.value === Roles.PUB.value;
    },
    isSubCon() {
      return this.role.value === Roles.SUBCON.value;
    },
    isSub() {
      return this.role.value === Roles.SUB.value;
    }
  },
  template: `
    <role-selection v-if="isUndefined" @roleSelected="selectRole"></role-selection>
    <publisher v-else-if="isPub" :channelId="channelId" :status="status" @publish="onPublish" @close="close"></publisher>
    <subscriber-connector v-else-if="isSubCon" @connectSubscriber="connectSubscriber" @close="close"/>
    <subscriber v-else-if="isSub" :channelId="channelId" :status="status" ref="valueConsumer" @close="close"/> 
  `
}