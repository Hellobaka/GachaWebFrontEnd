<template>
  <v-card style="padding: 1vw 1vw 2vw 1vw;">
    <v-card-title>修改个人信息</v-card-title>
    <div style="padding: 0 2vw;">
      <h4>头像</h4>
      <v-avatar
        size="62"
        color="primary"
        @click="alert"
      >
        <img :src="$store.getters.avatar" alt="alt">
      </v-avatar>
      <my-upload
        v-model="show"
        field="img"
        :width="300"
        :height="300"
        url="/upload"
        :params="params"
        :headers="headers"
        img-format="png"
        @crop-success="cropSuccess"
        @crop-upload-success="cropUploadSuccess"
        @crop-upload-fail="cropUploadFail"
      />
      <img :src="imgDataUrl">
    </div>
  </v-card>
</template>

<script>
import 'babel-polyfill'
import myUpload from 'vue-image-crop-upload/upload-2.vue'
export default {
  store: {},
  components: {
    'my-upload': myUpload
  },
  mounted() {
    console.log(this.store)
  },
  data: function() {
    return {
      show: false,
      params: {
        token: '123456798',
        name: 'avatar'
      },
      headers: {
        smail: '*_~'
      },
      imgDataUrl: '' // the datebase64 url of created image
    }
  },
  methods: {
    toggleShow() {
      this.show = !this.show
    },
    /**
			 * crop success
			 *
			 * [param] imgDataUrl
			 * [param] field
			 */
    cropSuccess(imgDataUrl, field) {
      console.log('-------- crop success --------')
      this.imgDataUrl = imgDataUrl
    },
    /**
			 * upload success
			 *
			 * [param] jsonData   服务器返回数据，已进行json转码
			 * [param] field
			 */
    cropUploadSuccess(jsonData, field) {
      console.log('-------- upload success --------')
      console.log(jsonData)
      console.log('field: ' + field)
    },
    /**
			 * upload fail
			 *
			 * [param] status    server api return error status, like 500
			 * [param] field
			 */
    cropUploadFail(status, field) {
      console.log('-------- upload fail --------')
      console.log(status)
      console.log('field: ' + field)
    }
  }
}
</script>

<style>

</style>
