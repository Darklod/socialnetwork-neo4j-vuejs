import axios from 'axios'
import jwt from 'jsonwebtoken'

const BASE_URL = 'http://192.168.1.3:3000'

export { login, logout, isAuthenticated, getUser }

import router from '../src/router/index'

function login (username, password) {
  const url = `${BASE_URL}/login`
  return axios.post(url, { username, password }).then(response => {
    console.log(response.data)
    if (response.data.success) {
      var token = response.data.token.split('JWT ')[1]
      var decoded = jwt.decode(token)
      var expiration = decoded.exp

      router.go('/')
    }
  })
}
