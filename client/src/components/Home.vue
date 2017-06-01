<template>
  <div class="home">
    <section class="section main">
      <div class="container">
        <div class="margin">
          <posts-list></posts-list>
        </div>
      </div>
    </section>

    <button class="button is-primary floating icon is-small add" @click.prevent="openModal()">
      <i class="material-icons">add</i>
    </button>

    <div class="modal" ref="modal">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">New Post</p>
          <button class="delete" @click.prevent="closeModal()"></button>
        </header>
        <section class="modal-card-body">
          <div class="field">
            <p class="control">
              <textarea class="textarea" v-model="text" placeholder="Textarea"></textarea>
            </p>
          </div>
        </section>
        <footer class="modal-card-foot">
          <a class="button is-success" @click.prevent="sendMessage()">Send</a>
          <a class="button" @click.prevent="closeModal()">Cancel</a>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import { createPost } from '../../utils/users'
import moment from 'moment'
import posts from './post/Posts.vue'

export default {
  name: 'home',
  components: {
    'posts-list': posts
  },
  data () {
    return {
      text: '',
      image: ''
    }
  },
  methods: {
    isToday (date) {
      return moment().format('DD/MM/YYYY') === date
    },
    sendMessage () {
      var tags = this.text.match(/#([^\s]*)/ig)
      tags = tags.map((x) => {
        return x.substring(1)
      })
      createPost(this.text, this.image, tags).then((res) => {
        //  upload file
        console.log(res)
      })
    },
    openModal () {
      this.$refs.modal.style.display = 'block'
    },
    closeModal () {
      this.$refs.modal.style.display = 'none'
    }
  }
}
</script>

<style scoped>
  .floating{
    position: fixed;
    right: 10px;
    bottom: 10px;
    width: 45px;
    height: 45px;
    align-items: center;
    border-radius: 100%;
  }
  .modal-card{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    height: 400px;
  }
  .margin{
    margin: 0px;
  }
  @media only screen and (min-width: 768px){
    .margin{
      margin-left: 20%;
      margin-right: 20%;
    }
  }
</style>
