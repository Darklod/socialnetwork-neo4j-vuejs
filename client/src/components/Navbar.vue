<template>
  <nav class="nav has-shadow">
    <div class="nav-center">
      <a class="nav-item">
        <img src="http://bulma.io/images/bulma-logo.png" alt="Bulma logo">
      </a>
    </div>

    <span class="nav-toggle" @click="toggleMenu">
      <span></span>
      <span></span>
      <span></span>
    </span>

    <div class="nav-left">
       <span class="navbar-item search-bar">
         <div class="field has-addons">
          <p class="control">
            <input class="input" autocomplete="off" id="search" v-model="query" :onkeypress="searchUsers" type="text" placeholder="Search">
          </p>
          <p class="control">
            <a class="button is-primary">
              <span class="icon is-small">
                <i class="fa fa-search"></i>
              </span>
            </a>
          </p>
        </div>
        <div ref="results" class="results">
          <div v-if="users && users.length" class="box">
             <div class="user" v-for="user of users">
              <router-link :to="'/users/' + user.username"><strong v-html="user.usernameB"></strong>
                 - <span v-html="user.firstnameB"></span> <span  v-html="user.lastnameB"></span></router-link>
             </div>
          </div>
          <div v-else class="box no-results">
              No Results Found.
          </div>
        </div>
      </span>
    </div>

    <div class="nav-right nav-menu">
      <a v-if="isAuth"  class="nav-item">
        <router-link to="/">Home</router-link>
      </a>
      <a v-if="isAuth"  class="nav-item">
        <router-link v-bind:to="'/users/'+user" >Profile</router-link>
      </a>
      <a v-if="isAuth"  class="nav-item">
        <router-link v-bind:to="'/messages/'" >Messages</router-link>
      </a>
      <a v-if="isAuth" v-on:click="logout()" class="nav-item">
        <router-link to="/">Logout</router-link>
      </a>
      <a v-if="!isAuth" class="nav-item">
        <router-link to="/Signup">Signup</router-link>
      </a>
      <a v-if="!isAuth" class="nav-item">
        <router-link to="/Login">Login</router-link>
      </a>
    </div>
  </nav>
</template>

<script>
import { getUsers } from '../../utils/users'
import jwt from 'jsonwebtoken'

export default {
  props: [],
  data () {
    return {
      user: '',
      users: [],
      query: '',
      isAuth: null
    }
  },
  methods: {
    logout () {
      this.$auth.destroyToken()
      this.$router.push('/login')
    },
    toggleMenu: function (e) {
      e.target.classList.toggle('is-active')
      document.querySelector('.nav-menu').classList.toggle('is-active')
    },
    getUser () {
      var user = jwt.decode(this.$auth.getToken())

      delete user['exp']
      delete user['token']

      this.$auth.setAuthenticatedUser(user)
      this.user = this.$auth.getAuthenticatedUser().username
      this.isAuth = this.$auth.isAuthenticated()
    }
  },
  computed: {
    searchUsers () {
      var res = this.$refs.results
      if (this.query) {
        getUsers(this.query).then((response) => {
          var re = new RegExp(this.query, 'gi')
          for (var i = 0; i < response.length; i++) {
            response[i].usernameB = response[i].username.replace(re, '<b class=\'bold\'>$&</b>')
            response[i].firstnameB = response[i].firstname.replace(re, '<b class=\'bold\'>$&</b>')
            response[i].lastnameB = response[i].lastname.replace(re, '<b class=\'bold\'>$&</b>')
          }
          this.users = response
          if (res) {
            res.style.display = 'block'
          }
        })
      } else {
        if (res) {
          res.style.display = 'none'
        }
      }
    }
  },
  mounted () {
    var q = document.querySelector('#search')
    var r = this.$refs.results
    if (q && r) {
      /*  q.onblur = () => {
        r.style.display = 'none'
      } */
      q.onfocus = () => {
        if (this.query) {
          r.style.display = 'block'
        }
      }
    }

    document.querySelector('.nav-toggle').classList.remove('is-active')
    document.querySelector('.nav-menu').classList.remove('is-active')
  },
  created () {
    this.getUser()
  },
  watch: {
    $route: function () {
      this.getUser()
      document.querySelector('.nav-toggle').classList.remove('is-active')
      document.querySelector('.nav-menu').classList.remove('is-active')
    }
  }
}
</script>

<style scoped>
  .box {border-radius: 0px;padding: 0px;}
  .box > *{
    padding-top: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid lightgray;
  }
  .no-results {
    padding-top: 10px;
    padding-bottom: 10px;
  }
  .box > *:last-child{
    border-bottom: 0px;
  }
  .nav {
    position: fixed;
    width: 100%;
  }
  .nav-left {
    overflow: visible;
    margin-left: 10px;
  }
  .search-bar {
    width: 70%;
    position: relative;
    top: 8px;
  }
  .search-bar .control:first-child{
    width: 100%;
  }
  .results{
    z-index: 20;
    margin-top: -12px;
    margin-left: 1px;
    background-color: antiquewhite;
    display: none;
  }
  @media only screen and (max-width:800px) {
    .search-bar {
      width: calc(100% - 10px);
    }
  }
</style>
