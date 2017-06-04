<template>
  <div v-if="posts && posts.length">
    <div class="grid">
      <post v-for="post in posts" :key="post.id" :toggleVote="toggleVote" :post="post"></post>
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
      toggleVote (id, liked) {
        setTimeout(() => {
          if (!liked) {
            upvotePost(id)
          } else {
            downvotePost(id)
          }
          this.getPosts()
        }, 0)
      }
    },
    created () {
      this.getPosts()
    },
    watch: {
      $route: function (a) {
        this.getPosts()
      }
    }
  }
</script>
