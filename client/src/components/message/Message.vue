<template>
  <div v-if="message" class="message">
    <div :class="message.isLoggedUser ? 'left':'right'">
      <div v-if="message.image">
        <img :src="'/static/images/' + message.image"/>
      </div>
      <span>{{message.date}} {{message.hour}}</span> {{message.text}}
    </div>
    <div style="clear:both"></div>
  </div>
</template>

<script>
export default {
  props: ['message']
}
</script>

<style scoped>
  img {
    width: 100%;
  }
  .message {
    width: 100%;
    margin-bottom: 0px;
    background-color: inherit; 
  }
  .left {
    width: 30%;
    float: left;
  }
  .right {
    width: 30%;
    float: right;
  }
</style>
