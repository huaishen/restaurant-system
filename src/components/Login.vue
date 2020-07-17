<template>
  <div class="login_container">
    <div class="login_box">
      <!-- left box: Logo -->
      <div class="logo_box">
        <img src="../assets/icons/company_logo.png" alt="">
        <h2>Welcome to</h2>
        <h2>Food Paradise</h2>
      </div>
      <!-- right box: Login form -->
      <div class="form_box">
        <h2 style="padding-top: 5%">Login</h2>
        <el-form :model="loginForm" :rules="loginRules" ref="loginForm" class="login_form"
                 label-position="top" :hide-required-asterisk="true">
          <!-- Username input box -->
          <el-form-item class="input_box" prop="username" label="Username" style="font-size: 16px;">
            <el-input v-model="loginForm.username" prefix-icon="iconfont iconicon-username"></el-input>
          </el-form-item>
          <!-- Password input box -->
          <el-form-item class="input_box" prop="password" label="Password">
            <el-input @keyup.enter.native="submitForm('loginForm')"
                      v-model="loginForm.password" prefix-icon="iconfont iconpassword" type="password">
            </el-input>
          </el-form-item>
          <!-- Submit button-->
          <el-button @click="submitForm('loginForm')"
                     style="background-color:#336699; color: white; width: 25%; font-weight: bold;">LOGIN</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      /* Store the information in the login form */
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{
          required: true, message: 'Please type in your username', trigger: 'blur'
        }],
        password: [{
          required: true, message: 'Please type in your password', trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    /* Submit the form and user login */
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.post('login', this.loginForm)
          if (res.status !== 200) return this.$message.error('The username and/or password you specified are not correct.')
          window.sessionStorage.setItem('token', res.access_token)
          this.$router.push('/home')
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .login_container {
    background-color: #99CCFF;
    height: 100%;
  }

  .login_box {
    width: 600px;
    height: 400px;
    background-color: white;
    border-radius: 10px;
    text-align: center;
    border: 1px black solid;
    /*put the login box to the center of the page*/
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .logo_box {
    width: 40%;
    height: 100%;
    border-right: 1px black solid;
    background-color: #336699;
    float: left;
    img {
      width: 80%;
      height: 50%;
      vertical-align: center;
    }
    color: #fff;
  }

  @form_width: calc(60% - 1px);
  .form_box {
    width: @form_width;
    float: left;
  }

  .login_form {
    position: absolute;
    bottom: 5%;
    transform: translate(0, -10%);
    width: @form_width;
    text-align: center;
    box-sizing: border-box;

    .input_box {
      width: 90%;
      margin-left: 5%;
    }
  }
</style>
