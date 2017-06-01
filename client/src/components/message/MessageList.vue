<template>
    <div>
        <message v-for="message in messages" key="message.id" :message="message"></message>
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
          this.messages = response
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
