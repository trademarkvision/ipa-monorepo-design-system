<template lang="html">
  <div id="timeoutPopup">
    <div class="page-hover"></div>
    <div class="content" @click.prevent.stop="closeAndRefresh">
      <font-awesome-icon :icon="['far', 'clock']"></font-awesome-icon>
      <h2>Your session has expired.</h2>Please refresh the page to continue working.
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';

  @Component({
    components: {}
  })
  export default class TimeoutPopup extends Vue {
    created() {
      window.setInterval(function () {
        let elementById = document.getElementById("timeoutPopup");
        if (elementById) {
          elementById.classList.add("active");
        }
      }, 1000 * 60 * 60 * 10); // 10 hours
    }

    closeAndRefresh() {
      window.location.reload();
    }
  }
</script>

<style scoped lang="scss">
  #timeoutPopup {
    display: none;
    visibility: hidden;
    &.active {
      display: block;
      visibility: visible;
      position: absolute;
      z-index: 99999;
      top: 0;
      left: 0;
      .page-hover {
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, .4);
        position: fixed;
        top: 0;
      }
      .content {
        position: absolute;
        width: 400px;
        background: white;
        border-radius: 5px;
        padding: 10px 10px 15px 10px;
        text-align: center;
        top: 170px;
        left: 50vw;
        margin: 0 auto 0 -205px;
        font-weight: 100;
        font-size: .9rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        svg {
          font-size: 30px;
          margin: 10px;
        }
        h2 {
          font-size: 1.1rem;
          margin: 0 0 3px 0;
          font-weight: 600;
          line-height: 1.1rem;
        }
      }
    }
  }
</style>
