<template>
  <div class="grid-item">
    <div class="card">
      <div class="header">
        <img :src="'/static/images/' + (post.userImage ?
                   'profiles/'+ post.userImage :
                   'default/avatar.png')">
        <strong>{{post.username}}</strong>
        <div class="is-pulled-right"><small>{{time}}</small></div>
        <div style="clear:both"></div>
      </div>
      <div v-if="post.postImage && post.postImage!=''" class="card-image">
        <figure class="image">
          <img :src="'/static/images/' + post.postImage" alt="Image">
        </figure>
      </div>
      <div class="card-content">
        <div class="content">
          <p v-html="post.text"></p>
          <nav class="level">
            <div class="level-left">
              <div class="level-item">
              </div>
            </div>
            <div class="level-right">
              <a class="level-item">
                <span class="icon is-small" @click.prevent="toggleVote(post)">
                  <i v-if="post.liked" class="fa fa-heart"></i>
                  <i v-if="!post.liked" class="fa fa-heart-o"></i>
                </span>
                <span class="counter like">{{post.likes}}</span>
              </a>
              <a class="level-item">
                <span class="icon is-small">
                  <i class="fa fa-comment"></i>
                </span>
                <span class="counter comment">0{{post.comments}}</span>
              </a>
            </div>
          </nav>
        </div>
      </div>
      <div v-if="false"><!--COMMENTS-->
        <div class="card-content" style="padding-top: 10px;padding-bottom: 0px;border-top: 1px solid lightgray;">
          <div>
            <div style="padding-bottom: 5px;">
              <p><small>29/05/2017 08:23 <b>Gianluca</b> ok</small></p>
              <p><small>29/05/2017 08:28 <b>Pierpaolo</b> .-.</small></p>
            </div>
          </div>
        </div>
        <div class="field has-addons" style="padding: 5px">
          <p class="control" style="width:100%">
            <input class="input" type="text" placeholder="Comments...">
          </p>
          <p class="control">
            <a class="button is-primary">
              <span class="icon is-small">
                <i class="fa fa-send"></i>
              </span>
            </a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
//  import { upvotePost, downvotePost } from '../../../utils/users'
export default {
  props: ['post', 'toggleVote'],
  computed: {
    time () {
      return moment(moment.unix('' + this.post.createdAt)).fromNow()
    }
  }
  /*  ,sockets: {
    like (data) {
      if (data.like) {
        this.post.likes++
        this.post.liked = true
      } else {
        this.post.likes--
        this.post.liked = false
      }
    }
  },
  methods: {
    toggleVote () {
      if (!this.post.liked) {
        upvotePost().then(() => {
          this.post.liked = !this.post.liked
          this.$socket.emit('like', { from: this.$auth.getAuthenticatedUser(), postId: this.post.id, like: true })
        })
      } else {
        downvotePost().then(() => {
          this.post.liked = !this.post.liked
          this.$socket.emit('like', { from: this.$auth.getAuthenticatedUser(), postId: this.post.id, like: false })
        })
      }
    }
  }  */
}
</script>

<style scoped>
  .grid-item{
    padding-bottom: 10px;
  }
  .card-content:first-child{
    padding-top: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid lightgray;
  }
  .card-content img{
    width: 35px;
    height: 35px;
    margin-right: 10px;
  }
  .card-content img, span{
    float: left;
  }
  .header {
    border-bottom: 1px solid lightgray;
  }
  .header img {
    width: 50px;
    height: 50px;
    float: left;
    margin-right: 10px;
    padding: 3px;
  }
  .header strong {
    float: left;
    top: 12px;
    position: relative;
  }
  .header div > small {
    float: right;
    top: 16px;
    margin-right: 10px; 
    position: relative;
  }
  .counter{
    padding-left: 5px;
  }
  .fa.fa-heart,.fa.fa-heart-o,.like{
    color:crimson;
  }
  .fa.fa-comment, .comment{
    color:#2cbb64;
  }
  nav.level {
    display: flex;
  }
  nav.level .level-right {
    display: flex;
  }
  .level-item {
    margin-bottom: 0px;
  }
  .content p{
    word-wrap: break-word;
  }
  .level-left + .level-right {
    margin-top: 0px;
  }
</style>
