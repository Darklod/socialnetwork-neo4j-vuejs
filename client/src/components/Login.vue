<template>
    <div>
      <div class="container">
        <section class="section main">
          <div class="columns"> 
            <div class="column is-one-third is-offset-4">
              <center>
                <h1 class="title">Social Graph</h1>
                <img class="logo" src="/static/images/icon.png"/>
              </center>
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
                      <button class="button is-info is-pulled-right" @click="handleLogin">
                        Login
                      </button> 
                      <router-link to="/signup">
                        <button class="button is-pulled-right">
                          Register Now
                        </button>
                      </router-link>
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
  }
}
</script>

<style scoped>
  .logo {
    height: 100px;
    width: 100px;
    padding: 10px;
  }
  .title {
    font-size: 50px;
    padding: 5px;
    padding-top: 86px; 
  }
  div{
    background-color: white;
  } 
  .section{
    padding: 0;
  }
  .title:not(:last-child), .subtitle:not(:last-child){
    margin-bottom: 0px;
  }
  button a {
    color: #555;
  }
  p.control button{
    margin-left: 10px; 
  }
</style>
