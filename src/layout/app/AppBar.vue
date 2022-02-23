<template>
  <v-app-bar app color="blue" dark>
    <v-app-bar-nav-icon @click.stop="navIconClick">
      <svg-icon name="menu" />
    </v-app-bar-nav-icon>
    <v-toolbar-title class="ml-0 pl-4">
      <span class="hidden-xs-only">屑平台后台管理系统</span>
    </v-toolbar-title>
    <v-spacer />

    <v-btn icon @click="switchDark">
      <v-icon>mdi-white-balance-sunny</v-icon>
    </v-btn>
    <v-btn icon>
      <svg-icon name="bell" />
    </v-btn>
    <v-menu
      transition="slide-y-transition"
      close-on-content-click
      offset-y
      bottom
    >
      <template v-slot:activator="{ on }">
        <v-btn icon large color="primary" dark v-on="on">
          <v-avatar size="32px" item>
            <v-img :src="$store.getters.avatar" alt="Vuetify" />
          </v-avatar>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="changeProfile">
          <v-icon>mdi-account</v-icon>
          <v-list-item-title>个人信息</v-list-item-title>
        </v-list-item>
        <v-list-item @click="changePassword">
          <v-icon>mdi-account-lock</v-icon>
          <v-list-item-title>修改密码</v-list-item-title>
        </v-list-item>
        <v-divider />
        <v-list-item @click="logout">
          <v-icon>mdi-logout</v-icon>
          <v-list-item-title>退出登录</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-dialog v-model="showForgetDialog" max-width="500">
      <ChangePassword v-if="showForgetDialog" :preEmail="pwdEmail" />
    </v-dialog>
  </v-app-bar>
</template>

<script>
import SvgIcon from '@/components/SvgIcon/index.vue'
import ChangeProfile from '@/components/ChangeProfile/index.vue'
import ChangePassword from '@/components/ChangePassword/index.vue'
export default {
  name: 'AppBar',
  components: {
    SvgIcon,
    ChangePassword
  },
  data() {
    return {
      dark: false,
      showForgetDialog: false,
      pwdEmail: ''
    }
  },
  methods: {
    navIconClick() {
      this.$store.dispatch('app/toggleSideBar')
    },
    changeProfile() {
      window.sessionStorage.setItem('store',
        JSON.stringify({ state: this.$store.state, baseURL: process.env.VUE_APP_BASE_API }))
      this.$dialog.show(ChangeProfile)
    },
    changePassword() {
      this.pwdEmail = this.$store.getters.email
      this.showForgetDialog = true
      // this.$dialog.show(ChangePassword)
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
    switchDark() {
      this.dark = !this.dark
      this.$vuetify.theme.dark = this.dark
    }
  }
}
</script>

<style scoped>
a{
  color: black !important;
}
.row> .col:hover{
  background-color: rgb(232,240,254);
}
</style>
