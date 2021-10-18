<template>
  <v-app style="background-image: url('https://www.toptal.com/designers/subtlepatterns/patterns/webb.png')">
    <v-main>
      <v-container fluid fill-height>
        <v-layout class="align-center justify-center">
          <v-flex xs12 sm8 md6 lg5 xl3>
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>屑平台后台登录</v-toolbar-title>
                <v-spacer />
              </v-toolbar>
              <v-card-text>
                <v-form ref="login_form">
                  <v-text-field
                    v-model="loginForm.username"
                    label="QQ或邮箱"
                    name="username"
                    prepend-icon="mdi-account"
                    type="text"
                    :rules="[rules.username]"
                  />
                  <v-text-field
                    id="password"
                    v-model="loginForm.password"
                    label="密码"
                    name="password"
                    prepend-icon="mdi-lock"
                    :type="passwordDisplay ? 'text' : 'password'"
                    :append-icon="passwordDisplay ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rules.password]"
                    @click:append="passwordDisplay = !passwordDisplay"
                  />

                </v-form>
              </v-card-text>
              <v-card-actions style="margin-left:10px;margin-right:10px;margin-top:-10px;">
                <v-btn
                  :loading="loginLoading"
                  color="primary"
                  @click="showForgetDialog"
                >我密码忘了</v-btn>
                <v-btn
                  :loading="loginLoading"
                  color="primary"
                  @click="showRegisterDialog"
                >我没有账号</v-btn>
                <v-spacer />
                <v-btn
                  :loading="loginLoading"
                  color="primary"
                  style="float:right"
                  @click="userLogin"
                >登录</v-btn>

              </v-card-actions>
            </v-card>
          </v-flex>
          <v-dialog v-model="registerVisible" max-width="600px">
            <v-card>
              <v-card-title>
                <span class="text-h5">注册</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-flex>
                    <v-form ref="reg_form">
                      <v-text-field
                        v-model="registerForm.QQ"
                        label="QQ*"
                        name="QQ"
                        prepend-icon="mdi-account"
                        type="text"
                        :rules="[QQVerify]"
                        :validate-on-blur="true"
                      />
                      <v-text-field
                        id="password"
                        v-model="registerForm.Password"
                        label="密码*"
                        name="password"
                        prepend-icon="mdi-lock"
                        :type="passwordDisplay ? 'text' : 'password'"
                        :append-icon="passwordDisplay ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[rules.password]"
                        @click:append="passwordDisplay = !passwordDisplay"
                      />
                      <v-text-field
                        v-model="registerForm.Email"
                        label="Email*"
                        name="Email"
                        prepend-icon="mdi-email"
                        type="email"
                        :rules="[EmailVerify]"
                        :validate-on-blur="true"
                      />
                      <v-text-field
                        v-model="registerForm.Nickname"
                        label="昵称*"
                        name="Nickname"
                        prepend-icon="mdi-account-heart-outline"
                        type="text"
                        :rules="[rules.requied]"
                      />
                    </v-form>
                    <v-btn color="error" :loading="regLoading" @click="registerVisible=false">
                      关闭
                    </v-btn>
                    <v-btn
                      color="primary"
                      :loading="regLoading"
                      style="float:right"
                      @click="registerHandler"
                    >
                      注册
                    </v-btn>
                  </v-flex>
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-dialog v-model="forgetVisible" max-width="600px">
            <ChangePassword />
          </v-dialog>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import ChangePassword from '@/components/ChangePassword/index.vue'
import { register, verifyQQ, verifyEmail, verifyCaptcha } from '@/api/user'
export default {
  name: 'Login',
  components: {
    'ChangePassword': ChangePassword
  },
  data() {
    return {
      passwordDisplay: false,
      loginLoading: false,
      regLoading: false,
      registerVisible: false,
      forgetVisible: false,
      QQUsable: true,
      EmailUsable: true,
      loginForm: {
        username: '',
        password: ''
      },
      registerForm: {
        QQ: '',
        Password: '',
        Email: '',
        Nickname: ''
      },
      captchaOption: {
        appid: '2038093986'
      },
      QQDuplicateVerify: true,
      EmailDuplicateVerify: true,
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
  methods: {
    captchaNotice(status, res) {
      console.log(status)
      console.log(res)
    },
    QQVerify(value) {
      const QQ = parseInt(value)
      if (!QQ) {
        return '无效的QQ'
      } else if (QQ < 10000) {
        return '无效的QQ'
      } else {
        verifyQQ(this.registerForm.QQ).then((response) => {
          if (response.msg !== 'ok') {
            this.QQUsable = false
            this.snackbar.Warning('此QQ已被使用', 1500)
            return '此QQ已被使用'
          }
          this.QQUsable = true
        })
      }
      return this.QQUsable
    },
    EmailVerify(value) {
      if (!value) {
        return '邮箱是被需要的'
      } else if (!/.+@.+/.test(value)) {
        return '无效的邮箱格式'
      } else {
        verifyEmail(this.registerForm.Email).then((response) => {
          if (response.msg !== 'ok') {
            this.EmailUsable = false
            this.snackbar.Warning('此邮箱已被使用', 1500)
            return '此邮箱已被使用'
          }
          this.EmailUsable = true
        })
      }
      return this.EmailUsable
    },
    userLogin() {
      if (!this.$refs.login_form.validate()) {
        return
      }
      // 表单验证成功
      this.loginLoading = true
      this.$store
        .dispatch('user/login', this.loginForm)
        .then(() => {
          this.$router.push({ path: this.redirect || '/' }) // 不报错就会到这里
          this.loading = false
        })
        .catch((msg) => {
          this.loading = false
          // this.snackbar.Error(msg)
        })
        .finally(() => {
          this.loginLoading = false
        })
    },
    registerHandler() {
      if (!this.$refs.reg_form.validate()) {
        return
      }
      // eslint-disable-next-line no-undef
      const captcha1 = new TencentCaptcha('2038093986', (res) => this.captchaCallback(res, this.doReg))
      captcha1.show()
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
    doReg() {
      this.regLoading = true
      register(this.registerForm).then(() => {
        this.snackbar.Success('注册成功')
      }).catch((err) => {
        this.snackbar.Error(err)
      }).finally(() => {
        this.regLoading = false
      })
    },
    showRegisterDialog() {
      this.registerVisible = true
    },
    showForgetDialog() {
      this.forgetVisible = true
    }
  }
}
</script>
