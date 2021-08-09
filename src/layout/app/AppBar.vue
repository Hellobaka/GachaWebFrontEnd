<template>
  <v-app-bar app color="blue" dark>
    <v-app-bar-nav-icon @click.stop="navIconClick">
      <svg-icon name="menu" />
    </v-app-bar-nav-icon>
    <v-toolbar-title class="ml-0 pl-4">
      <span class="hidden-xs-only">屑平台后台管理系统</span>
    </v-toolbar-title>
    <v-spacer />

    <v-menu
      transition="slide-y-transition"
      close-on-content-click
      offset-y
      bottom
      nudge-left="36"
    >
      <template v-slot:activator="{ on }">
        <v-btn icon large color="primary" dark v-on="on">
          <v-avatar size="32px" item>
            <v-img :src="$store.getters.avatar" alt="Vuetify" />
          </v-avatar>
        </v-btn>
      </template>
      <v-list>
        <v-list-item>
          <v-icon>mdi-account</v-icon>
          <v-list-item-title>个人信息</v-list-item-title>
        </v-list-item>
        <v-list-item>
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
    <v-menu
      transition="slide-y-transition"
      close-on-content-click
      offset-y
      bottom
      nudge-left="136"
      nudge-top="-10"
    >
      <template v-slot:activator="{ on }">
        <v-btn icon large dark v-on="on">
          <v-icon>
            mdi-apps
          </v-icon>
        </v-btn>
      </template>
      <v-card width="300" style="padding: 15px; text-align:center;">
        <v-row v-for="row in application" :key="row">
          <v-col v-for="col in row" :key="col" style="margin:5px; border-radius: 10px;">
            <a :href="col.href" style="display: block; width: 100%">
              <v-icon>
                {{ col.icon }}
              </v-icon>
              <div>{{ col.title }}</div>
            </a>
          </v-col>
        </v-row>
      </v-card>
    </v-menu>
    <v-btn icon>
      <svg-icon name="bell" />
    </v-btn>
    <screen-full />
  </v-app-bar>
</template>

<script>
import SvgIcon from '@/components/SvgIcon/index.vue'
import ScreenFull from '../screenFull/ScreenFull'

export default {
  name: 'AppBar',
  components: {
    SvgIcon,
    ScreenFull
  },
  data() {
    return {
      application: [
        [{ href: '/#/download', icon: 'mdi-download', title: '下载' }, { href: '/#/github', icon: 'mdi-github', title: 'Github' }, { href: '/#/poolPerview', icon: 'mdi-eye-settings-outline', title: '卡池预览' }],
        [{ href: '#', icon: 'mdi-apps', title: 'aaa' }, { href: '#', icon: 'mdi-apps', title: 'bbb' }, { href: '#', icon: 'mdi-apps', title: 'ccc' }],
        [{ href: '#', icon: 'mdi-apps', title: 'aaa' }, { href: '#', icon: 'mdi-apps', title: 'bbb' }, { href: '#', icon: 'mdi-apps', title: 'ccc' }]
      ]
    }
  },
  methods: {
    navIconClick() {
      this.$store.dispatch('app/toggleSideBar')
    },
    logout() {
      this.$store
        .dispatch('user/logout', this.$store.getters.token)
        .then(() => {
          // 刷新路由
          history.go('/login')
        })
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
