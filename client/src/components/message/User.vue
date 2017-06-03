<template>
  <li v-if="user">
    <div>
      <img :src="user.image ? '/static/images/profiles/' + user.image : '/static/images/default/avatar.png'"  />
      <router-link :to="'/messages/' + user.username">{{user.username}}</router-link>
    </div>
  </li>
</template>

<script>
export default {
  props: ['user']
}
</script>

<style scoped>
div{
    display: flex;
}
li{
    border-bottom: 1px solid lightgray;
    padding: 5px;
}
a{
  display: flex;
  align-items: center;
}
img {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}
</style>
