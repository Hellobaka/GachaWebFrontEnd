<template>
  <div transition="slide-x-transition">
    <v-card style="padding: 1vw; right: 1vw;">
      <v-card-title>个人信息</v-card-title>
      <v-card-subtitle>此处展示登录用户的昵称与权限</v-card-subtitle>
      <div style="display: flex;align-items: center;">
        <div style="width: 50px; height: 50px;margin:0 1vw;">
          <img :src="$store.getters.avatar" alt="" style="cursor: pointer; border-radius: 50%;width: 100%;background: lightgray;" @click="window.alert('change avatar')">
        </div>
        <div style="width: 50%;">
          <h2>{{ $store.getters.name }}</h2>
          <h3>{{ handlePermission($store.getters.roles) }}</h3>
        </div>
        <div style="right: 1vw; display: flex;justify-content: flex-end; width: 50%">
          <v-btn color="success" class="mainButton" @click="changeProfile">修改个人信息</v-btn>
          <v-btn color="success" class="mainButton" @click="changePassword">修改密码</v-btn>
          <v-btn color="error" class="mainButton" @click="logout">登出</v-btn>
        </div>
      </div>
    </v-card>
    <v-card style="margin-top: 5vw; padding: 1vw; right: 1vw;">
      <v-card-title>APIKey</v-card-title>
      <v-card-subtitle>APIKey用于接口的授权</v-card-subtitle>
      <div style="display: flex; right: 1vw;">
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
      </div>
    </v-card>
    <v-card style="margin-top: 5vw; padding: 1vw; right: 1vw;">
      <v-card-title>调用统计</v-card-title>
      <v-card-subtitle>现阶段无调用限额 若有异常调用请及时重置Key</v-card-subtitle>
      <div style="display: flex; margin: 0 3vw; justify-content: center; text-align: center; ">
        <v-card class="counter" @click="alert()">
          <h2>近24小时调用</h2>
          <span>
            <span style="font-size: 5vw;">{{ day1Count }}</span>
            次
          </span>
        </v-card>
        <v-card class="counter" @click="alert()">
          <h2>近15天调用</h2>
          <span>
            <span style="font-size: 5vw;">{{ day15Count }}</span>
            次
          </span>
        </v-card>
        <v-card class="counter" @click="alert()">
          <h2>近30天调用</h2>
          <span>
            <span style="font-size: 5vw;">{{ day30Count }}</span>
            次
          </span>
        </v-card>
      </div>
      <div style="margin: 1vw 3vw;">
        <h3>调用详情</h3>
        <v-data-table
          :loading="actionLoading"
          :headers="headers"
          :items="actionRecords"
          :items-per-page="rowsPerPage"
          class="elevation-1"
        />
      </div>
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
  width: 33vw;
  height: 13vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 1vw;
  background-color: white;
  transition: background-color .5s;
}
.counter:hover{
  background-color: rgb(231,234,239);
}
</style>
