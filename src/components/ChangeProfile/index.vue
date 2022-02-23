<template>
  <v-card style="padding: 5px;">
    <v-card-title>修改个人信息</v-card-title>
    <v-card-text>
      <v-avatar
        size="62"
        color="primary"
        @click="show = !(show||saveLoading)"
      >
        <img :src="state.user.avatar" alt="alt">
      </v-avatar>
      <v-btn :loading="saveLoading" color="primary" style="margin: 0 2vw;" @click="show = !show">更换头像</v-btn>
      <my-upload
        v-model="show"
        field="img"
        :width="300"
        :height="300"
        :url="baseURL + '/api/v1/user/Upload'"
        :params="params"
        :headers="headers"
        img-format="png"
        @crop-upload-success="cropUploadSuccess"
        @crop-upload-fail="cropUploadFail"
      />
      <div style="margin-top: 5px;">
        <div class="profileForm">
          <v-text-field
            :value="state.user.info.qq"
            label="QQ"
            disabled
          />
        </div>
        <div class="profileForm">
          <v-text-field
            :loading="saveLoading"
            :value="state.user.info.nickname"
            label="昵称"
            :disabled="saveLoading"
          />
        </div>
        <v-dialog v-model="changeEmailDialog" max-width="500">
          <ChangeEmail v-if="changeEmailDialog" />
        </v-dialog>
        <div class="profileForm">
          <v-text-field
            :value="state.user.info.email"
            disabled
            label="邮箱"
          />
          <v-btn
            color="primary"
            :loading="saveLoading"
            :disabled="saveLoading"
            style="margin-left: 10px;"
            @click="changeEmailDialog = !changeEmailDialog"
          >
            换绑
          </v-btn>
        </div>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn text :loading="saveLoading" @click="close">关闭</v-btn>
      <v-btn text color="primary" :loading="saveLoading" style="margin-left: 5px;">保存</v-btn>
    </v-card-actions>

  </v-card>
</template>

<script>
import 'babel-polyfill'
import myUpload from 'vue-image-crop-upload/upload-2.vue'
import ChangeEmail from '@/components/ChangeEmail/index.vue'
export default {
  store: {},
  components: {
    'my-upload': myUpload,
    ChangeEmail
  },
  data: function() {
    return {
      state: { token: '' },
      params: {
        name: 'avatar'
      },
      headers: {
        authorization: ''
      },
      baseURL: '',
      show: false,
      saveLoading: false,
      changeEmailDialog: false
    }
  },
  created() {
    const obj = JSON.parse(window.sessionStorage.getItem('store'))
    this.state = obj.state
    this.baseURL = obj.baseURL
    this.headers.authorization = 'Bearer ' + obj.state.user.token
  },
  methods: {
    close() {
      this.$emit('submit', this.state)
    },
    toggleShow() {
      this.show = !this.show
    },
    cropUploadSuccess(jsonData, field) {
      this.state.user.avatar = 'files/pics/' + jsonData.data[0]
      this.$dialog.notify.success('头像上传成功')
    },
    /**
			 * upload fail
			 *
			 * [param] status    server api return error status, like 500
			 * [param] field
			 */
    cropUploadFail(status, field) {
      this.$dialog.notify.error(status)
    }
  }
}
</script>

<style scoped>
  span{
    margin: 0 1vw;
  }
  .profileForm{
    display: flex;
    align-items: baseline;
  }
  .v-dialog{
    transition: all .5s;
  }
</style>
