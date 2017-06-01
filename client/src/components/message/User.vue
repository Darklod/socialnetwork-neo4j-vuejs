<template>
  <div v-if="user">
      <router-link :to="'/messages/' + user.username">{{user.username}}</router-link>
  </div>
</template>

<script>
export default {
  props: ['user']
}
</script>

<style scoped>
div{
    border-bottom: 1px solid lightgray;
    padding: 10px;
}
</style>
