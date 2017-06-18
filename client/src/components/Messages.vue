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
            <div class="header">
              {{this.$route.params.username || "-"}}
            </div>
            <div class="box" id="messages">
              <message-list class="msg-list" :messages="messages"></message-list>
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
import { createMessage, getMessages } from '../../utils/users'
import smoothScroll from '../../utils/smoothScroll'

export default {
  components: {
    'message-list': MessageList,
    'user-list': UserList
  },
  data () {
    return {
      text: '',
      image: '',
      messages: []
    }
  },
  methods: {
    getMessages () {
      if (this.$route.params.username) {
        getMessages(this.$route.params.username).then((response) => {
          var date = null
          var messages = []
          //  works only if the list is already ordered
          response.forEach((x) => {
            if (x.date !== date) {
              date = x.date
              messages.push({date: date})
            }
            delete x.date
            messages.push(x)
          })
          this.messages = messages
        })
      }
    },
    sendMessage () {
      createMessage(this.$route.params.username, this.text, this.image).then((response) => {
        //  if (response.success) {
        this.$socket.emit('newMessage', response)
        delete response.message['date']
        response.message.isLoggedUser = false
        this.messages.push(response.message)
        var elem = document.querySelector('#messages')
        smoothScroll(elem, elem.scrollHeight, 2000)
        //  }
      })
      this.text = ''
    }
  },
  created () {
    this.getMessages()
  },
  mounted () {
    window.onload = function () {
      var elem = document.querySelector('#messages')
      smoothScroll(elem, elem.scrollHeight, 0)
    }
  },
  watch: {
    $route: function () {
      window.onload = function () {
        var elem = document.querySelector('#messages')
        smoothScroll(elem, elem.scrollHeight, 0)
      }
    }
  },
  sockets: {
    newMessage (data) {
      delete data.message['date']
      data.message.isLoggedUser = true
      this.messages.push(data.message)
      var elem = document.querySelector('#messages')
      smoothScroll(elem, elem.scrollHeight, 2000)
    }
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
  height: 330px;
  margin:0px;
  overflow-y: scroll;
  box-shadow: none;
}
.section{
  margin-left: 20%;
  margin-right: 20%;
}
.header{
  padding: 5px;
  padding-left: 15px;
  background-color: #2592eb;
  color:white;
  font-size: 16px;
}
</style>
