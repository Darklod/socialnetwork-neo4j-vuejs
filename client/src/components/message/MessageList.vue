<template>
  <div>
    <div v-if="messages && messages.length">
      <message v-for="message in messages" key="message.id" :message="message"></message>
    </div>
    <div v-else style="padding:5px;">
      No messages yet.
    </div>
  </div>
</template>

<script>
import Message from './Message'
import { getMessages } from '../../../utils/users'
export default {
  components: {
    'message': Message
  },
  data () {
    return {
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
          console.log(messages)
          this.messages = messages
        })
      }
    }
  },
  created () {
    this.getMessages()
  }
}
</script>

<style scoped>
div{
    padding: 10px;
}
</style>
