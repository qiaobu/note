<template>
  <div class="app-wrapper" :class="classObj">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"></div>
    <sidebar class="sidebar-container"></sidebar>
    <div class="main-container">
      <navbar></navbar>
      <tags-view></tags-view>
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
// import Navbar from './components/Navbar'
// import Sidebar from './components/Sidebar'
// import AppMain from './components/AppMain'
// import TagsView from './components/TagsView'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'layout',
  data() {
    return {
    }
  },
  components: {
    // Navbar,
    // Sidebar,
    // AppMain,
    // TagsView
    Sidebar: () => import('./components/Sidebar'),
    Navbar: () => import('./components/Navbar'),
    AppMain: () => import('./components/AppMain'),
    TagsView: () => import('./components/TagsView')
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
  .main-container{
    overflow: hidden;
    height: 100%;
  }
  .navbar,.tags-view-container{
    position: fixed;
    left: 210px;
    right: 0;
    z-index: 99;
    transition:all .28s;
  }
  .tags-view-container{
    top: 43px;
  }
  .app-main{
    height: calc(100% - 86px);
    margin-top: 86px;
    overflow: auto;
    transition: .28s;
    position: relative;
  }
  @media (max-width: 768px){
  .app-main{
    margin-top: 43px;
    height: calc(100% - 43px);
  }
}
</style>
