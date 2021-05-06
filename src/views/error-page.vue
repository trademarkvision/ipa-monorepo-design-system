<template lang="html">
  <div id="errorPage">
    <navbar :go-home="goHome" :hide-drop-down="true" app-title="Dashboard"></navbar>
    <div class="flex-content-container">
      <div class="flex-columns">
        <div class="errorContainer" v-if="errorTitle">
          <h1 style="opacity: .6;">
            <font-awesome-icon :icon="['far', errorIcon]"></font-awesome-icon>
          </h1>
          <h3>{{errorTitle}}</h3>
          <div v-html="errorContent"></div>
        </div>
        <div class="errorContainer" v-else>
          <h1 style="opacity: .6;">
            <font-awesome-icon :icon="['far', 'frown']"></font-awesome-icon>
          </h1>
          <h3>Something went wrong...</h3>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';

  import Navbar from "../components/navbar.vue";

  const BASE_URL = (<any>window).BASE_URL;

  @Component({
    components: {
      Navbar
    }
  })
  export default class ErrorPage extends Vue {
    goHome() {
      window.location.href = BASE_URL;
    }

    get errorContent() {
      return (window as any).ERROR_CONTENT;
    }

    get errorTitle() {
      return (window as any).ERROR_TITLE;
    }

    get errorIcon() {
        return (window as any).ERROR_ICON || 'bug';
    }

  }
</script>
<style lang="scss">
  @import '../../styles/definitions';

  #errorPage {
    .errorContainer {
      margin-top: 3rem;
      width: 100%;
      text-align: center;
    }
  }
</style>
