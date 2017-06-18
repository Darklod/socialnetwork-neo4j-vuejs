<template>
  <div>
    <ul v-if="users && users.length">
      <user v-for="user in users" key="user.id" :user="user"></user>
    </ul>
    <div v-else style="padding:5px;">
      No users yet.
    </div>
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
  mounted () {
    this.getFollowers()
  }
}
</script>
