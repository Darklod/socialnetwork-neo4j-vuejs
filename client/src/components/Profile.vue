<template>
   <div class="profile">
      <div v-if="currentUser">
         <div class="card is-fullwidth">
            <input type="file" v-if="IsTheLoggedUser" id="cover" style="display:none" @change="coverChanged" />
            <label for="cover" style="cursor:pointer">
              <header class="card-header" ref="cover">
              </header>
            </label>
            <div class="card-content">
               <center>
                  <a class="card-avatar">
                    <input type="file" v-if="IsTheLoggedUser" id="image" style="display:none" @change="imageChanged" />
                    <label for="image" style="cursor:pointer">
                      <img src="/static/images/default-image.png" ref="image" class="card-avatar-img">
                    </label>
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
               <div v-if="!IsTheLoggedUser" class="right">
                  <a class="button is-primary" @click.prevent="ToggleFollow()">{{follows}}</a>
               </div>
               <div>
                  <p class="description">
                    <strong>{{ currentUser.firstname }} {{ currentUser.lastname }} </strong>
                    {{ currentUser.description }}
                  </p>
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
      <br/>
      <div v-if="posts && posts.length">
         <div class="container margin">
            <div class="grid">
               <div class="grid-sizer"></div>
               <div class="grid-item" v-for="post in posts">
                  <div class="card">
                     <div v-if="post.image" class="card-image">
                        <figure class="image">
                           <img :src="'../../static/images/'+post.image" alt="Image">
                        </figure>
                     </div>
                     <div class="card-content">
                        <div class="content">
                           <div v-html="post.text"></div>
                           <br>
                           <small>{{post.hour}} {{post.date}}</small>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <br/>
         <br/>
      </div>
      <div v-else>
        <div class="container">
          <br>
            <center style="font-size:24px;padding:30px;">No posts yet.</center>
          <br>
        </div>
      </div>
      <br/>
   </div>
</template>

<script>
import { getUserByUsername,
         getFollowersByUsername,
         getFollowedByUsername,
         IsFollowed,
         Follows,
         getPostsByUsername
        } from '../../utils/users'
import Masonry from 'masonry-layout'

export default {
  name: 'profile',
  data () {
    return {
      currentUser: {},
      followers: 0,
      followed: 0,
      posts: [],
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
    Reload (username) {
      getUserByUsername(username).then(response => {
        this.currentUser = response
        var path = '/static/images/'

        this.$refs.cover.style.backgroundImage = 'url("' + path + (response.cover
        ? 'profiles/' + response.cover
        : 'default/cover.jpg') + '")'

        this.$refs.image.src = response.image
        ? path + 'profiles/' + response.image
        : path + 'default/avatar.png'
      })
      getFollowersByUsername(username).then(response => { this.followers = response })
      getFollowedByUsername(username).then(response => { this.followed = response })
      getPostsByUsername(username).then(response => {
        response.forEach((d) => {
          console.log(d)
          var re = new RegExp(/#([^\s]*)/ig, 'gi')
          d.text = d.text.replace(re, '<a href=\'/tags/$1\'>$&</a>')
        })
        this.posts = response
        setTimeout(() => {
          var grid = document.querySelector('.grid')
          if (grid) {
            /* eslint-disable no-new */
            new Masonry(grid, {
              itemSelector: '.grid-item',
              columnWidth: '.grid-sizer',
              percentPosition: false,
              gutter: 10,
              containerStyle: null
            })
          }
        }, 400) //  !!!!!!
      })
    },
    imageChanged (e) {
      var fileReader = new FileReader()

      fileReader.readAsDataURL(e.target.files[0])

      fileReader.onload = (e) => {
        this.$refs.image.src = e.target.result
      }
    },
    coverChanged (e) {
      var fileReader = new FileReader()

      fileReader.readAsDataURL(e.target.files[0])

      fileReader.onload = (e) => {
        this.$refs.cover.style.backgroundImage = 'url("' + e.target.result + '")'
      }
    }
  },
  computed: {
    IsTheLoggedUser () {
      return this.currentUser.username === this.loggedUser.username
    },
    loggedUser () {
      return this.$auth.getAuthenticatedUser()
    },
    IsFollowed () {
      IsFollowed(this.currentUser.username).then((response) => {
        this.follows = response.success
        return response.success ? 'Follows' : 'Followed'
      })
    }
  },
  mounted () {
    this.Reload(this.$route.params.username)
  }
}
</script>

<style scoped>
  .grid {
    margin: 0 auto;
  }
  .grid-item{
    margin-bottom: 10px;
  }
  .grid-sizer, .grid-item {
    width: calc(100% / 3.06);
  }
  .card-header {
      background-image: url("../../static/images/default/cover.jpg");
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

  /*@media only screen and (max-width: 1100px) {
    .grid-sizer, .grid-item { width: calc(100% / 4); }
  }*/

  @media only screen and (max-width: 900px) {
    .grid-sizer, .grid-item { width: 49%; }
  }

  @media only screen and (max-width: 720px) {
    .grid-sizer, .grid-item { width: 100%; }
  }
</style>
