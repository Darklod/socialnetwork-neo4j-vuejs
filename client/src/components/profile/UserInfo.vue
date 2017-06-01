<template>
  <div v-if="currentUser">
     <div class="card is-fullwidth">
        <header class="card-header">
        </header>
        <div class="card-content">
           <center>
              <a class="card-avatar">
              <img src="/static/images/default-image.png" class="card-avatar-img">
              </a>
           </center>
           <h4>{{ currentUser.username }}</h4>
           <br/>
           <div>
              {{ currentUser.email }}
           </div>
           <div>
              {{ currentUser.phone }}
           </div>
           <br/>
           <div v-if="!IsTheLoggedUser()" class="right">
              <a class="button is-primary" @click.prevent="ToggleFollow()">{{IsFollowed}}</a>
              <a href="currentUser.username">Scrivi</a>
           </div>
           <div>
              <p class="description"><strong>{{ currentUser.firstname }} {{ currentUser.lastname }} </strong>{{ currentUser.description }}</p>
           </div>
           <hr>
           <nav class="level is-mobile">
              <div class="level-item has-text-centered">
                 <div>
                    <p class="heading">Posts</p>
                    <p class="title">{{posts.length}}</p>
                 </div>
              </div>
              <div class="level-item has-text-centered">
                 <div>
                    <p class="heading">Following</p>
                    <p class="title">{{followed.length}}</p>
                 </div>
              </div>
              <div class="level-item has-text-centered">
                 <div>
                    <p class="heading">Followers</p>
                    <p class="title">{{followers.length}}</p>
                 </div>
              </div>
           </nav>
        </div>
     </div>
  </div>
</template>

<script>
import { IsFollowed, Follows } from '../../../utils/users'

export default {
  props: ['currentUser', 'loggedUser', 'posts', 'followers', 'followed'],
  data () {
    return {
      follows: null
    }
  },
  methods: {
    ToggleFollow () {
      if (!this.follows) {
        Follows(this.loggedUser.username, this.currentUser.username)
      } else {
        //  Unfollows()
      }
      this.follows = !this.follows
    },
    IsTheLoggedUser () {
      return this.currentUser.username === this.loggedUser.username
    }
  },
  computed: {
    IsFollowed () {
      var res = IsFollowed(this.currentUser.username)
      this.follows = res
      return res ? 'Followed' : 'Follows'
    }
  }
}
</script>

<style scoped>
  .card-header {
      background-image: url("/static/images/default-cover.jpg");
      background-position: 50% 50%;
      background-repeat: no-repeat;
      background-size: cover;
      background-origin: content-box;
      border-bottom: 1px solid #e1e8ed;
      height: 195px;
      width: 100%;
  }
  h4 {
      font-size: 140%;
  }
  .description{
    word-break: break-all;
  }
  .card-content {
      padding-top: 13px;
  }
  .card-avatar {
      background-color: #fff;
      border-radius: 100%;
      display: inline-block !important;
      margin: -80px 5px 0 8px;
      max-width: 100%;
      padding: 1px;
  }
  .card-avatar img {
    border: 3px solid #fff;
    border-radius: 100%;
    width: 128px;
    height: 128px;
  }
  .card-stats-list {
    box-sizing: border-box;
    display: table;
    margin: 0;
    min-width: 100%;
    padding: 0;
    table-layout: auto;
  }
  ul.card-stats-list {
    list-style: outside none none;
    margin: 0;
    padding: 0;
  }
  .right {
    float: right;
    margin: -130px 0 5px 0;
  }
</style>
