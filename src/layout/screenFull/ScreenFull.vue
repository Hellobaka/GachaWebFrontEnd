<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-btn icon v-on="on" @click.native="screenFull">
        <svg-icon v-show="!isScreenFull" name="fullscreen" />
        <svg-icon v-show="isScreenFull" name="fullscreen_exit" />
      </v-btn>
    </template>
    <span>{{ content }}</span>
  </v-tooltip>
</template>

<script>
import screenfull from 'screenfull'
import SvgIcon from '@/components/SvgIcon/index'
export default {
  name: 'Index',
  components: { SvgIcon },
  data() {
    return {
      isScreenFull: false
    }
  },
  computed: {
    content() {
      return this.isScreenFull ? '取消全屏' : '全屏'
    }
  },
  mounted() {
    screenfull.onchange(() => {
      this.isScreenFull = screenfull.isFullscreen
    })
  },
  methods: {
    screenFull() {
      if (!screenfull.isEnabled) {
        // 如果不允许进入全屏，发出不允许提示
        alert('Your browser does not support screenfull!')
        return false
      }
      this.isScreenFull = !this.isScreenFull
      screenfull.toggle()
    }
  }
}
</script>

<style scoped></style>
