<template>
  <div v-if="posts && posts.length">
    <div class="grid">
      <post v-for="post in posts" :key="post.id" :toggleVote="toggleVote" :post="post"></post>  <!-- REMEBER TO PASS PROPS HERE !!!! -->
    </div>
  </div>
</template>

<script>
  import post from './Post.vue'
  import { getPosts, getPostsByTag, upvotePost, downvotePost } from '../../../utils/users'

  export default {
    components: {
      post: post
    },
    data () {
      return {
        posts: []
      }
    },
    methods: {
      getPosts () {
        var tag = this.$route.params.tag || null
        if (!tag) {
          getPosts().then(data => {
            data.forEach((d) => {
              var re = new RegExp(/#([^\s]*)/ig, 'gi')
              d.text = d.text.replace(re, '<a href=\'/tags/$1\'>$&</a>')
            })
            this.posts = data
          })
        } else {
          getPostsByTag(tag).then(data => {
            data.forEach((d) => {
              var re = new RegExp(/#([^\s]*)/ig, 'gi')
              d.text = d.text.replace(re, '<a href=\'/tags/$1\'>$&</a>')
            })
            this.posts = data
          })
        }
      },
      toggleVote (p) {
        if (!p.liked) {
          upvotePost(p.id).then(() => {
            p.liked = !p.liked
            p.likes++
            this.$socket.emit('like', { from: this.$auth.getAuthenticatedUser(), postId: p.id, like: true })
          })
        } else {
          downvotePost(p.id).then(() => {
            p.liked = !p.liked
            p.likes--
            this.$socket.emit('like', { from: this.$auth.getAuthenticatedUser(), postId: p.id, like: false })
          })
        }
      }
    },
    created () {
      this.getPosts()
    },
    mounted () {
      this.getPosts()
    },
    watch: {
      $route: function () {
        this.getPosts()
      }
    },
    sockets: {
      like (data) {
        var id = data.postId
        var index = null

        this.posts.forEach((p, i) => {
          if (p.id === id) {
            index = i
            return
          }
        })

        if (data.like) {
          this.posts[index].likes++
          //  this.posts[index].liked = true
        } else {
          this.posts[index].likes--
          //  this.posts[index].liked = false
        }
      }
    }
  }
</script>
