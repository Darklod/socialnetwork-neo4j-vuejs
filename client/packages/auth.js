export default function (Vue) {
  let authenticatedUser = {}
  Vue.auth = {
    setToken (token, expiration) {
      localStorage.setItem('token', token)
      localStorage.setItem('expiration', expiration)
    },
    getToken () {
      var token = localStorage.getItem('token')
      var expiration = localStorage.getItem('expiration')

      if (!token || !expiration) {
        return null
      }

      if (Date.now() / 1000 > parseInt(expiration)) {
        console.log('token expired!')
        return null
      } else {
        return token
      }
    },
    destroyToken () {
      localStorage.removeItem('token')
      localStorage.removeItem('expiration')
    },
    isAuthenticated () {
      return this.getToken()
    },
    getAuthenticatedUser () {
      return authenticatedUser
    },
    setAuthenticatedUser (data) {
      authenticatedUser = data
    }
  }

  Object.defineProperties(Vue.prototype, {
    $auth: {
      get () {
        return Vue.auth
      }
    }
  })
}
