<template>
  <section class="hero is-fullheight is-primary is-light is-bold">
    <div class="hero-body">
      <div class="container">
        <div class="columns is-vcentered">
          <div class="column is-4 is-offset-4">
            <h1 class="title">
              Register an Account
            </h1>
            <div class="box">
              <label class="label">Firstname</label>
              <p class="control">
                <input class="input" placeholder="John" type="text">
              </p>
              <label class="label">Laststname</label>
              <p class="control">
                <input class="input" placeholder="Smith" type="text">
              </p>
              <label class="label">Email</label>
              <p class="control">
                <input class="input" placeholder="jsmith@example.org" type="text">
              </p>
              <label class="label">Username</label>
              <p class="control">
                <input class="input" placeholder="jsmith" type="text">
              </p>
              <hr>
              <label class="label">Password</label>
              <p class="control">
                <input class="input" placeholder="●●●●●●●" type="password">
              </p>
              <label class="label">Confirm Password</label>
              <p class="control">
                <input class="input" placeholder="●●●●●●●" type="password">
              </p>
              <hr>
              <p class="control">
                <button class="button is-primary">Register</button>
                <button class="button is-default">Cancel</button>
              </p>
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

export default {
  name: 'signup',
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
  },
  mounted () {
    document.querySelector('.nav').style.display = 'none'
    document.querySelector('.footer').style.display = 'none'
  },
  destroyed () {
    document.querySelector('.nav').style.display = 'flex'
    document.querySelector('.footer').style.display = 'none'
  }
}
</script>
