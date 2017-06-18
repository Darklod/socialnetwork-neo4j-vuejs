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
          <div class="is-pulled-left">
            <input type="file" id="file" @change="imageChanged"  style="display:none;margin-right: 50px;"/>
            <label for="file" class="button is-primary">Add Image</label>
          </div>
          <img ref="preview" height="64" width="64" style="margin: 10px;height: 80px;width: auto;" />
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
import posts from './post/Posts.vue'

export default {
  name: 'home',
  components: {
    'posts-list': posts
  },
  data () {
    return {
      text: '',
      image: '' // new FormData()
    }
  },
  methods: {
    sendMessage () {
      var tags = this.text.match(/#([^\s]*)/ig)
      if (tags) {
        tags = tags.map((x) => {
          return x.substring(1)
        })
      }
      createPost(this.text, this.image, tags).then((res) => {
        //  this.$children.posts.getPosts()
        //  should refresh posts list
      })
      this.closeModal()
    },
    openModal () {
      this.$refs.modal.style.display = 'block'
    },
    closeModal () {
      this.$refs.modal.style.display = 'none'

      this.$refs.preview.removeAttribute('src')
      document.querySelector('input[type=file]').value = ''
      this.text = ''
    },
    imageChanged (e) {
      var fileReader = new FileReader()

      fileReader.readAsDataURL(e.target.files[0])

      //  this.data = new FormData()
      //  this.data.append('image', e.target.files[0])

      fileReader.onload = (e) => {
        this.$refs.preview.src = e.target.result
        this.image = e.target.result
      }
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
  .modal-card-body {
    padding: 15px 20px 0px 20px;
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
