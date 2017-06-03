<template>
    <div class="section">
      <div class="columns">
        <div class="column is-one-third">
          <div class="box">
            <user-list></user-list>
          </div>
        </div>
        <div class="column">
          <div class="box">
            <div class="box" id="messages">
              <message-list class="msg-list"></message-list>
            </div>
            <div class="field has-addons">
              <p class="control" style="width:100%">
                <input class="input" v-model="text" placeholder="Write a message..." autocomplete="off" type="text">
              </p>
              <p class="control" >
                <a class="button is-primary" @click.prevent="sendMessage">
                  <span class="icon is-small">
                    <i class="fa fa-send"></i>
                  </span>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import MessageList from './message/MessageList'
import UserList from './message/UserList'
import { createMessage } from '../../utils/users'
import smoothScroll from '../../utils/smoothScroll'

export default {
  components: {
    'message-list': MessageList,
    'user-list': UserList
  },
  data () {
    return {
      text: '',
      image: ''
    }
  },
  methods: {
    sendMessage () {
      createMessage(this.$route.params.username, this.text, this.image).then((response) => {
        //  websocket send in broadcast
      })
    }
  },
  mounted () {
    //  when new message received
    var elem = document.querySelector('#messages')
    smoothScroll(elem, elem.scrollHeight, 2000)
  }
}
</script>

<style scoped>
.box {
  height: 400px;
  border-radius: 0px;
  padding: 0px
}
#messages{
  height: 364px;
  margin:0px;
  overflow-y: scroll;
}
.section{
  margin-left: 20%;
  margin-right: 20%;
}
</style>
