import Vue from 'vue'

const EventBus = new Vue()

export default 
Object.defineProperties(Vue.prototype, {
  $bus: {
    get: function () {
      return EventBus
    }
  }
})