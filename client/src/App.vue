<template>
    <div id="app">
      <div class="container">
        <div class="row">
          <div class="sidebar col-3">
            <app-sidebar ref="sidebar"></app-sidebar>
          </div>
          <div class="home col-9">
            <app-home ref="home"></app-home>
          </div>
        </div>
      </div>
    </div>
  </template>

<script>
  import store from "./store";
  import { defineAsyncComponent } from 'vue'

  const Sidebar = defineAsyncComponent(() => import(/* webpackChunkName: "sidebar" */ "./components/Sidebar.vue"));
  import Home from "./components/Home.vue";

  export default {
  components: {
    appHome: Home,
    appSidebar: Sidebar
  }
};
</script>