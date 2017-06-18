<template>
  <section class="hero is-fullheight is-primary is-light is-bold">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-vcentered">
          <div class="column is-4 is-offset-4">
            <center>
              <h1 class="title">
                Register an Account
              </h1>
            </center>
            <br>
            <div class="box">
              <label class="label">Firstname</label>
              <p class="control">
                <input class="input" v-model="firstname" placeholder="John" type="text">
              </p>
              <label class="label">Lastname</label>
              <p class="control">
                <input class="input" v-model="lastname" placeholder="Smith" type="text">
              </p>
              <label class="label">Username</label>
              <p class="control">
                <input class="input" v-model="username" placeholder="jsmith" type="text">
              </p>
              <label class="label">Email</label>
              <p class="control">
                <input class="input" v-model="email" placeholder="jsmith@example.org" type="text">
              </p>
              <label class="label">Phone (optional)</label>
              <p class="control">
                <input class="input" v-model="phone" placeholder="3444858583" type="text">
              </p>
              <hr>
              <label class="label">Password</label>
              <p class="control">
                <input class="input" v-model="password" placeholder="●●●●●●●" type="password">
              </p>
              <label class="label">Confirm Password</label>
              <p class="control">
                <input class="input" v-model="password2" placeholder="●●●●●●●" type="password">
              </p>
              <hr>
              <p class="control">
                <button class="button is-primary is-pulled-right" @click.prevent="handleSignup">Register</button>
              </p>
              <div style="clear:both"></div>
            </div>
            <p class="has-text-centered">
              <router-link to="/Login">Already have an account? Login</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
export default {
  name: 'signup',
  data () {
    return {
      username: '',
      password: '',
      password2: '',
      firstname: '',
      lastname: '',
      email: '',
      phone: ''
    }
  },
  methods: {
    handleSignup () {
      var username = this.username
      var password = this.password
      var email = this.email
      var firstname = this.firstname
      var lastname = this.lastname
      var phone = this.phone

      if (password !== this.password2) {
        console.log('password doesn\'t match')
        return
      }

      var host = 'localhost' || '172.22.20.49'
      axios.post('http://' + host + ':3000/register', { username, password, email, firstname, lastname, phone }).then(response => {
        console.log(response.data)
        if (response.data.success) {
          this.$router.push('/')
        }
      })
    }
  }
}
</script>
