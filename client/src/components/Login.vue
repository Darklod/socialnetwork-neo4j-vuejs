<template>
    <div>
      <div class="container">
        <img class="is-pulled-left logo" src="/static/images/icon.png"/>
        <h1 class="title">Social Graph</h1>
      </div>
      <div class="container">
        <section class="section main">
          <div class="columns"> 
            <div class="column is-one-third">
              <div class="columns">
                <div class="column">
                  <div class="field">
                      <p class="control has-icons-left">
                        <input type="text" class="input" v-model="username" placeholder="Username">
                        <span class="icon is-small is-left">
                          <i class="fa fa-envelope"></i>
                        </span>
                      </p>
                  </div>
                  <div class="field">
                    <p class="control has-icons-left">
                      <input class="input" type="password" v-model="password" placeholder="Password">
                      <span class="icon is-small is-left">
                        <i class="fa fa-lock"></i>
                      </span>
                    </p>
                  </div>
                  <div class="field">
                    <p class="control">
                      <button class="button is-success" @click="handleLogin">
                        Login
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <!-- REGISTER -->
            <div class="column is-offset-2 is-one-third">
              <div class="columns">
                <div class="column">
                  <div class="field">
                      <p class="control has-icons-left">
                        <input type="text" class="input" v-model="username" placeholder="Username">
                        <span class="icon is-small is-left">
                          <i class="fa fa-envelope"></i>
                        </span>
                      </p>
                  </div>
                  <div class="field">
                    <p class="control has-icons-left">
                      <input class="input" type="password" v-model="password" placeholder="Password">
                      <span class="icon is-small is-left">
                        <i class="fa fa-lock"></i>
                      </span>
                    </p>
                  </div>
                  <div class="field">
                    <p class="control">
                      <button class="button is-success" @click="handleLogin">
                        Login
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
   </div>
</template>

<script>
import axios from 'axios'
import jwt from 'jsonwebtoken'

export default {
  name: 'login',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    handleLogin () {
      var username = this.username
      var password = this.password
      var host = 'localhost' || '172.22.20.49'
      axios.post('http://' + host + ':3000/login', { username, password }).then(response => {
        if (response.data.success) {
          var token = response.data.token.split('JWT ')[1]
          var decoded = jwt.decode(token)
          var expiration = decoded.exp

          this.$socket.emit('login', decoded)

          this.$auth.setToken(token, expiration)

          this.$router.push('/')
        }
      })
    }
  },
  mounted () {
    document.querySelector('.nav').style.display = 'none'
  },
  destroyed () {
    document.querySelector('.nav').style.display = 'flex'
  }
}
</script>

<style scoped>
  .logo {
    height: 100px;
    width: 100px;
    margin-right: 10px;
  }
  .title {
    font-size: 50px;
    padding: 25px;
  }
  div{
    background-color: white;
  } 
</style>
