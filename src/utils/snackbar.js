import Vue from 'vue'

function Success(msg, timeout = 1500) {
  Vue.prototype.$toast.success(msg, {
    timeout: timeout,
    queueable: true,
    showClose: true,
    closeIcon: 'mdi-close',
    icon: 'mdi-checkbox-marked-circle-outline'
  })
}
function Info(msg, timeout = 1500) {
  Vue.prototype.$toast.info(msg, {
    timeout: timeout,
    queueable: true,
    showClose: true,
    closeIcon: 'mdi-close',
    icon: 'mdi-information-outline'
  })
}
function Warning(msg, timeout = 3500) {
  Vue.prototype.$toast.warning(msg, {
    timeout: timeout,
    queueable: true,
    showClose: true,
    closeIcon: 'mdi-close',
    icon: 'mdi-alert-circle-outline'
  })
}
function Error(msg, timeout = 3500) {
  Vue.prototype.$toast.error(msg, {
    timeout: timeout,
    queueable: true,
    showClose: true,
    closeIcon: 'mdi-close',
    icon: 'mdi-alert'
  })
}
export default {
  Success,
  Info,
  Warning,
  Error
}
