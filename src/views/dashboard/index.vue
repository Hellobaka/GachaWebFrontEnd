<template>
  <div transition="slide-x-transition" style="margin-right: 20px;">
    <v-card>
      <v-card-title>APIKey</v-card-title>
      <v-card-subtitle>APIKey用于接口的授权</v-card-subtitle>
      <v-card-text>
        <v-text-field
          id="apiKeyInput"
          :value="APIKey"
          filled
          readonly
          placeholder="点击右侧按钮获取APIKey"
          label="APIKey"
          prepend-icon="mdi-clipboard"
          append-icon="mdi-refresh"
          :loading="apiKeyLoading"
          @click:prepend="copyAPIKey"
          @click:append="reGenAPIKey"
        />
      </v-card-text>
    </v-card>
    <v-card style="margin-top: 10px;">
      <v-card-title>调用统计</v-card-title>
      <v-card-subtitle>现阶段无调用限额 若有异常调用请及时重置Key</v-card-subtitle>
      <div style="display: flex; margin: 0 10px; justify-content: center; text-align: center; ">
        <v-card class="counter" @click="alert()">
          <v-card-title>近24小时调用</v-card-title>
          <span>
            <span style="font-size: 5vw;">{{ day1Count }}</span>
            次
          </span>
        </v-card>
        <v-card class="counter" @click="alert()">
          <v-card-title>近15天调用</v-card-title>
          <span>
            <span style="font-size: 5vw;">{{ day15Count }}</span>
            次
          </span>
        </v-card>
        <v-card class="counter" @click="alert()">
          <v-card-title>近30天调用</v-card-title>
          <span>
            <span style="font-size: 5vw;">{{ day30Count }}</span>
            次
          </span>
        </v-card>
      </div>

      <v-expansion-panels style="margin-top: 10px;">
        <v-expansion-panel>
          <v-expansion-panel-header>
            调用详情
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-data-table
              :loading="actionLoading"
              :headers="headers"
              :items="actionRecords"
              :items-per-page="rowsPerPage"
              class="elevation-1"
            />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </div>
</template>

<script>
import { reGenAPIKey } from '@/api/apikey'
import { getActionRecords } from '@/api/user'
import moment from 'moment'
import ChangeProfile from '@/components/ChangeProfile/index.vue'
import ChangePassword from '@/components/ChangePassword/index.vue'

export default {
  data() {
    return {
      apiKeyLoading: false,
      APIKey: this.$store.getters.APIKey,
      actionLoading: true,
      headers: [
        { text: '来源IP', value: 'requestIP', sortable: true },
        { text: '操作', value: 'action', sortable: true },
        { text: '详情', value: 'info' },
        { text: '时间', value: 'time', sortable: true }
      ],
      day1Count: 0,
      day15Count: 0,
      day30Count: 0,
      rowsPerPage: 15,
      actionRecords: []
    }
  },
  mounted() {
    this.actionLoading = true
    getActionRecords().then((data) => {
      this.actionRecords = data.data
      // this.actionRecords = [...this.actionRecords, ...this.actionRecords, ...this.actionRecords]
      const day15 = new Date() - 1000 * 60 * 60 * 24 * 15
      const day30 = new Date() - 1000 * 60 * 60 * 24 * 30
      const day1 = new Date() - 1000 * 60 * 60 * 24
      this.actionRecords.map(item => {
        if (new Date(item.time) > day1) this.day1Count++
        if (new Date(item.time) > day15) this.day15Count++
        if (new Date(item.time) > day30) this.day30Count++

        item.time = moment(item.time).format('YYYY-MM-DD HH:mm:ss')
      })
    }).finally(() => {
      this.actionLoading = false
    })
  },
  methods: {
    handlePermission(name) {
      switch (name) {
        case 'user':
          return '普通用户'
        case 'developer':
          return '开发者'
        case 'admin':
          return '系统管理员'
      }
    },
    copyAPIKey() {
      const fakeEle = document.createElement('input')
      fakeEle.value = this.$store.getters.APIKey
      document.body.appendChild(fakeEle)
      fakeEle.select()
      document.execCommand('Copy')
      document.body.removeChild(fakeEle)
      this.snackbar.Success('复制成功')
    },
    reGenAPIKey() {
      this.apiKeyLoading = true
      reGenAPIKey(!!this.$store.getters.APIKey).then((data) => {
        this.$store.dispatch('user/resetAPIKey', data.data.apiKey).then(() => {
          this.APIKey = data.data.apiKey
          this.snackbar.Success('APIKey刷新成功')
        })
      }).finally(() => {
        this.apiKeyLoading = false
      })
    },
    logout() {
      this.$dialog.confirm({
        text: '确认要退出吗？',
        title: '退出登录'
      }).then(data => {
        if (data) {
          this.$store
            .dispatch('user/logout', this.$store.getters.token)
            .then(() => {
              history.go('/login')
            })
        }
      })
    },
    changeProfile() {
      window.sessionStorage.setItem('store',
        JSON.stringify({ state: this.$store.state, baseURL: process.env.VUE_APP_BASE_API }))
      this.$dialog.show(ChangeProfile, this.$store)
    },
    changePassword() {
      this.$dialog.show(ChangePassword)
    }
  }
}
</script>

<style scoped>
.mainButton{
  margin: 0 .5vw;
}
.counter{
  min-width: 13%;
  height: 10%;
  max-width: 33%;
  max-height: 13%;
  display: flex;
  margin-right: 10px;
  flex-direction: column;
  justify-content: center;
  border-radius: 10px;
  align-items: center;
}
.counter:hover{
  background-color: rgb(231,234,239);
}
</style>
