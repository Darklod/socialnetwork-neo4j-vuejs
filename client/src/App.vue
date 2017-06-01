<template>
  <div id="app">
    <navbar></navbar>
    <transition name="fade" mode="out-in">
      <router-view :key="$route.params.username"></router-view>
    </transition>
    <footer class="footer">
      <div class="container">
        <div class="content has-text-centered">
          <p>
            &copy; 2017 Giuseppe Magazz&ugrave; All Rights Reserved.
          </p>
          <!--<p>
            <a class="icon" href="https://github.com/jgthms/bulma">
              <i class="fa fa-github"></i>
            </a>
          </p>-->
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import navbar from './components/Navbar.vue'

export default {
  name: 'app',
  components: {
    'navbar': navbar
  }
}
</script>

<style lang="scss">
  @import "~bulma/sass/utilities/initial-variables.sass";

  //72d0eb
  $primary:  #2592eb;
  $primary-invert:  #fff;
  $danger: $orange;

  @import "~bulma";

  body {
    background-color: gainsboro;
  }
  .bold{
    color: orange;
  }
  .section{
    padding-top: 84px;
    background-color: inherit;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .2s
  }
  .fade-enter, .fade-leave-active {
      opacity: 0
  }
  .field.has-addons .control:first-child .button,
  .field.has-addons .control:first-child .input,
  .field.has-addons .control:first-child .select select,
  .field.has-addons .control:last-child .button,
  .field.has-addons .control:last-child .input,
  .field.has-addons .control:last-child .select select{
      box-shadow: none;
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
      border-top-left-radius: 0px;
      border-top-right-radius: 0px;
  }
</style>
