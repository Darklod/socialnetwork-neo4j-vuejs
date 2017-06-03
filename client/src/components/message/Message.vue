<template>
  <div>
    <div v-if="message.date" class="has-text-centered">{{message.date}}<hr></div>
    <div v-else-if="message" class="message">
      <div :class="(message.isLoggedUser ? 'left':'right') + ' box'">
        <div v-if="message.image">
          <img :src="'/static/images/' + message.image"/>
        </div>
        <span>{{message.hour}}</span> {{message.text}}
      </div>
      <div style="clear:both"></div>
    </div>
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
    font-size: 12px;
  }
  .left {
    width: 35%;
    float: left;
    background-color: lightgreen;
  }
  .right {
    width: 35%;
    float: right;
    background-color: lightblue;
  }
  .box{
    margin-bottom: 0px;
    padding: 0.5rem;
    border-radius: 0px;
  }
</style>
