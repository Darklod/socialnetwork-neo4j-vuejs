<template>
    <div>
        <user v-for="user in users" key="user.id" :user="user"></user>
    </div>
</template>

<script>
import User from './User.vue'
import { getFollowedByUsername } from '../../../utils/users'
export default {
  components: {
    'user': User
  },
  data () {
    return {
      users: []
    }
  },
  methods: {
    getFollowers () {
      var user = this.$auth.getAuthenticatedUser()
      getFollowedByUsername(user.username).then((response) => {
        this.users = response
      })
    }
  },
  created () {
    this.getFollowers()
  }
}
</script>

<style>

</style>
