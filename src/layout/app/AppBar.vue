<template>
  <v-app-bar app color="blue" dark>
    <v-app-bar-nav-icon @click.stop="navIconClick">
      <svg-icon name="menu" />
    </v-app-bar-nav-icon>
    <v-toolbar-title class="ml-0 pl-4">
      <span class="hidden-xs-only">屑平台后台管理系统</span>
    </v-toolbar-title>
    <v-spacer />

    <screen-full />
    <v-btn icon>
      <svg-icon name="apps" />
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
      <v-list dense>
        <v-list-item @click="logout">
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
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
  data: () => ({}),
  methods: {
    navIconClick() {
      this.$store.dispatch('app/toggleSideBar')
    },
    logout() {
      this.$store.dispatch('user/logout', this.$store.getters.token).then(() => {
        // 刷新路由
        history.go('/login')
      })
    }
  }
}
</script>

<style scoped></style>
