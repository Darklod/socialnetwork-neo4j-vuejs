import axios from 'axios'

const BASE_URL = 'http://localhost:3000' || 'http://172.22.20.49:3000' //  Cambiare IP

export { getUsers,
         getPosts,
         getPostsByTag,
         getPostsByUsername,
         createPost,
         uploadImage,
         upvotePost,
         downvotePost,
         getMessages,
         createMessage,
         getUserByUsername,
         getFollowersByUsername,
         getFollowedByUsername,
         IsFollowed,
         Follows,
         Unfollows,
         UpdateUser }

const token = 'JWT ' + localStorage.getItem('token')

function getUsers (query) {
  const url = `${BASE_URL}/api/users`
  return axios.get(url, {'headers': { 'Authorization': token }, 'params': {'q': query}}).then(response => response.data)
}

function getUserByUsername (usr) {
  const url = `${BASE_URL}/api/users/` + usr
  return axios.get(url, {'headers': { 'Authorization': token }}).then(response => response.data)
}

function getFollowersByUsername (username) {
  const url = `${BASE_URL}/api/users/${username}/followers`
  return axios.get(url, {'headers': { 'Authorization': token }}).then(response => response.data)
}

function getFollowedByUsername (username) {
  const url = `${BASE_URL}/api/users/${username}/followed`
  return axios.get(url, {'headers': { 'Authorization': token }}).then(response => response.data)
}

function getPosts () {
  const url = `${BASE_URL}/api/users/me/posts`
  return axios.get(url, {'headers': { 'Authorization': token }}).then(response => response.data)
}

function getPostsByTag (tag) {
  const url = `${BASE_URL}/api/users/posts/` + tag
  return axios.get(url, {'headers': { 'Authorization': token }}).then(response => response.data)
}

function createPost (text, image, tags) {
  const url = `${BASE_URL}/api/users/me/posts`
  return axios.post(url, {text, image, tags}, {'headers': { 'Authorization': token }}).then(response => response.data)
}

function uploadImage (image) {
  const url = `${BASE_URL}/api/upload`
  return axios.post(url, {image}, {'headers': { 'Authorization': token }}).then(response => response.data)
}

function upvotePost (post) {
  const url = `${BASE_URL}/api/users/me/likes/` + post
  return axios.post(url, null, {'headers': { 'Authorization': token }}).then(response => response.data)
}

function downvotePost (post) {
  const url = `${BASE_URL}/api/users/me/likes/` + post
  return axios.delete(url, {'headers': { 'Authorization': token }}).then(response => response.data)
}

function getPostsByUsername (username) {
  const url = `${BASE_URL}/api/users/${username}/posts`
  return axios.get(url, {'headers': { 'Authorization': token }}).then(response => response.data)
}

function getMessages (username) {
  const url = `${BASE_URL}/api/users/me/messages/` + username
  return axios.get(url, {'headers': { 'Authorization': token }}).then(response => response.data)
}

function createMessage (username, text, image) {
  const url = `${BASE_URL}/api/users/me/messages/` + username
  return axios.post(url, {text, image}, {'headers': { 'Authorization': token }}).then(response => response.data)
}

function IsFollowed (user) {
  const url = `${BASE_URL}/api/users/me/follows/` + user
  return axios.get(url, {'headers': { 'Authorization': token }}).then(response => response.data)
}

function Follows (user) {
  const url = `${BASE_URL}/api/users/me/follows/`
  return axios.post(url, {user}, {'headers': { 'Authorization': token }}).then(response => response.data)
}

function Unfollows (user) {
  const url = `${BASE_URL}/api/users/me/follows/` + user
  return axios.delete(url, {'headers': { 'Authorization': token }}).then(response => response.data)
}

function UpdateUser (data) {
  const url = `${BASE_URL}/api/users/me/`
  return axios.put(url, data, {'headers': { 'Authorization': token }}).then(response => response.data)
}
