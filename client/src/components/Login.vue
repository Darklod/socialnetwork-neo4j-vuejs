<template>
  <div class="container">
    

    <center>
      <h1>Title</h1>
      <div>
        <h1 class="is-pulled-left">Login</h1>
        <img src="/static/images/icon.png"/>
        <h1 class="is-pulled-right">Register</h1>
      </div>
    </center>

    <section class="section main">
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
    </section>
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
