<template>
  <v-card>
    <v-card-title>邮箱修改</v-card-title>
  </v-card>
</template>

<script>
export default {
  name: 'ChangeEmail',
  props: {
    email: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      captcha: '',
      captchaLoading: false
    }
  }
}
</script>

<style scoped>

</style>
