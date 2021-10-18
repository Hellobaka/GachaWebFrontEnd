<template>
  <v-card style="padding: 1vw 1vw 2vw 1vw;">
    <v-card-title>修改密码</v-card-title>
    <div style="margin: 0 1vw;">
      <v-stepper
        v-model="forgetStep"
        vertical
      >
        <v-stepper-step
          :complete="forgetStep > 1"
          step="1"
        >
          需要找回密码的邮箱
          <small>QQ相关功能开发中</small>
        </v-stepper-step>

        <v-stepper-content step="1">
          <v-text-field
            v-model="forgetForm.email"
            label="邮箱"
            clearable
            type="email"
            :rules="[rules.username]"
            :validate-on-blur="true"
          />
          <v-btn
            color="primary"
            :loading="forgetForm.verifyEmailLoading"
            @click="forget_verifyEmail"
          >
            验证
          </v-btn>
        </v-stepper-content>

        <v-stepper-step
          :complete="forgetStep > 2"
          step="2"
        >
          填写邮箱验证码
        </v-stepper-step>

        <v-stepper-content step="2">
          <div style="display: flex;">
            <v-text-field
              v-model="forgetForm.captchacode"
              label="验证码"
              clearable
            />
            <v-btn
              color="primary"
              style="margin:5px"
              :disabled="forgetForm.captchaText !== '获取验证码'"
              :loading="forgetForm.captchaLoading"
              @click="forget_getEmailCaptcha"
            >
              {{ forgetForm.captchaText }}
            </v-btn>
          </div>
          <v-btn
            color="primary"
            :loading="forgetForm.captchaVerifyLoading"
            @click="forget_VerifyEmailCaptcha"
          >
            验证
          </v-btn>
        </v-stepper-content>

        <v-stepper-step
          :complete="forgetStep > 3"
          step="3"
        >
          重置密码
        </v-stepper-step>

        <v-stepper-content step="3">
          <v-text-field
            v-model="forgetForm.newpwd"
            label="新密码"
            prepend-icon="mdi-lock"
            :type="passwordDisplay ? 'text' : 'password'"
            :append-icon="passwordDisplay ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.password]"
            @click:append="passwordDisplay = !passwordDisplay"
          />
          <v-text-field
            v-model="forgetForm.confirmnewpwd"
            label="重复新密码"
            prepend-icon="mdi-lock"
            :type="passwordDisplay ? 'text' : 'password'"
            :append-icon="passwordDisplay ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[forget_confirmpwdVerify]"
            @click:append="passwordDisplay = !passwordDisplay"
          />
          <v-btn
            color="primary"
            :loading="forgetForm.finalLoading"
            @click="forgetHandler"
          >
            提交
          </v-btn>
        </v-stepper-content>
      </v-stepper>

    </div>
  </v-card>
</template>

<script>
import { verifyCaptcha, verifyEmailCaptcha, getEmailCaptcha, resetPwd } from '@/api/user'
export default {
  name: 'ChangePassword',
  data() {
    return {
      passwordDisplay: false,
      forgetStep: 1,
      forgetForm: {
        email: '',
        newpassword: '',
        captchacode: '',
        second: 0,
        captchaText: '获取验证码',
        sessionID: '',
        captchaLoading: false,
        captchaVerifyLoading: false,
        newpwd: '',
        confirmnewpwd: '',
        finalLoading: false,
        verifyEmailLoading: false
      },
      rules: {
        requied: value => !!value || '不可为空',
        username: value => {
          if (!value) {
            return '用户名是被需要的'
          } else if (!/^[a-zA-Z0-9_@.]+$/.test(value)) {
            return '无效的用户名'
          }
          return true
        },
        password: value => {
          if (!value) {
            return '密码是被需要的'
          } else if (value.length < 6) {
            return '密码的长度需要长于6'
          }
          return true
        }
      }
    }
  },
  mounted() {
    this.forgetForm.sessionID = ''
    this.forgetStep = 1
    this.forgetForm.captchacode = ''
    const s1 = document.createElement('script')
    s1.type = 'text/javascript'
    s1.src = 'https://ssl.captcha.qq.com/TCaptcha.js'
    document.body.appendChild(s1)
    const s2 = document.createElement('script')
    s2.type = 'text/javascript'
    s2.src = 'http://pv.sohu.com/cityjson?ie=utf-8'
    document.body.appendChild(s2)
  },
  methods: {
    close() {
      this.$emit('submit', true)
    },
    captchaCallback(res, func) {
      // 返回结果
      // ret         Int       验证结果，0：验证成功。2：用户主动关闭验证码。
      // ticket      String    验证成功的票据，当且仅当 ret = 0 时 ticket 有值。
      // CaptchaAppId       String    验证码应用ID。
      // bizState    Any       自定义透传参数。
      // randstr     String    本次验证的随机串，请求后台接口时需带上。

      // res（用户主动关闭验证码）= {ret: 2, ticket: null}
      // res（验证成功） = {ret: 0, ticket: "String", randstr: "String"}
      if (res.ret === 0) {
        // eslint-disable-next-line no-undef
        verifyCaptcha(res.randstr, res.ticket, returnCitySN['cip']).then((response) => {
          if (response.data.CaptchaCode !== 1) {
            this.snackbar.Error(response.data.CaptchaMsg)
            return
          }
          func()
        })
      } else if (res.ret === 2) {
        this.snackbar.Warning('取消验证码操作')
      }
    },
    forget_verifyEmail() {
      this.forgetForm.verifyEmailLoading = true
      // eslint-disable-next-line no-undef
      const captcha1 = new TencentCaptcha('2038093986', (res) => this.captchaCallback(res, this.nextStep))
      captcha1.show()
    },
    forget_getEmailCaptcha() {
      if (this.forgetForm.second !== 0) {
        return
      }
      this.forgetForm.captchaLoading = true
      getEmailCaptcha(this.forgetForm.email).then(response => {
        if (response.msg === 'ok') {
          this.forgetForm.second = 60
          this.forgetForm.sessionID = response.data
          this.forgetForm.captchaText = this.forgetForm.second + '秒后重新获取'
          setInterval(() => {
            if (this.forgetForm.second === 0) {
              this.forgetForm.captchaText = '获取验证码'
            } else {
              this.forgetForm.second--
              this.forgetForm.captchaText = this.forgetForm.second + '秒后重新获取'
            }
          }, 1000)
          this.forgetForm.captchaLoading = false
        }
      }).catch(() => { this.forgetForm.captchaLoading = false })
    },
    forget_confirmpwdVerify() {
      if (this.forgetForm.newpwd !== this.forgetForm.confirmnewpwd) {
        return '两次密码不一致'
      }
      return true
    },
    nextStep() {
      if (this.forgetStep === 3) {
        return
      }
      this.forgetStep++
      this.forgetForm.verifyEmailLoading = false
    },
    forget_VerifyEmailCaptcha() {
      this.forgetForm.captchaVerifyLoading = true
      verifyEmailCaptcha(this.forgetForm.captchacode, this.forgetForm.sessionID).then((response) => {
        this.forgetStep = 3
        this.forgetForm.captchaVerifyLoading = false
      }).catch(() => { this.forgetForm.captchaVerifyLoading = false })
    },
    forgetHandler() {
      this.forgetForm.finalLoading = true
      resetPwd(this.forgetForm.sessionID, this.forgetForm.newpwd).then(() => {
        this.snackbar.Success('密码重置成功')
        this.forgetForm.finalLoading = false
        this.$store
          .dispatch('user/logout', this.$store.getters.token)
          .then(() => {
            history.go('/login')
          })
        close()
      }).catch(() => { this.forgetForm.finalLoading = false })
    }
  }
}
</script>

<style>
.v-dialog{
  background-color: white;
}
</style>
<style lang="scss" scoped>

</style>
