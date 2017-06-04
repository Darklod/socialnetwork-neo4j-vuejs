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
export default {
  components: {
    'message': Message
  },
  props: ['messages']
}
</script>

<style scoped>
div{
    padding: 10px;
}
</style>
