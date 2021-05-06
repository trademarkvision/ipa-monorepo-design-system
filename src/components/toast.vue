<template lang="html">
  <div id="toasts">
    <div class="toast-toast" :class="'toast-' + (t.type + ' ' + (!t.visible ? 'hide' : ''))"
         v-for="t in toasts"
         :key="t.id"
         :id="t.id"
         @click.prevent.stop="dismiss(t)">
      <div class="toast-icon">
        <font-awesome-icon v-if="t.type === 'error'" :icon="['far', 'times-circle']"></font-awesome-icon>
        <font-awesome-icon v-else-if="t.type === 'success'" :icon="['far', 'check-circle']"></font-awesome-icon>
        <font-awesome-icon v-else :icon="['fas', 'info-circle']"></font-awesome-icon>
      </div>
      <div class="toast-content">
        <p v-if="t.title" class="toast-title" v-html="t.title"></p>
        <p v-if="t.message" class="toast-message" v-html="t.message"></p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import Vue from "vue";
  import {Component} from 'vue-property-decorator';
  import {NumberDictionary} from "../../src/models/common";

  export interface ToastMessage {
    title?: string;
    message?: string;
    visible?: boolean;
    type?: 'error' | 'info';
    duration?: number;
    id?: number;
    destroy?: boolean;
  }

  @Component({
    components: {}
  })
  export default class Toast extends Vue {

    private toasts: Array<ToastMessage> = [];
    private timeouts: NumberDictionary<any> = [];

    created() {
      this.$root.$on('toast', (d: ToastMessage) => {
        d.id = (new Date()).getTime();
        this.addToast(d);
      });
    }

    private dismiss(d: ToastMessage) {
      clearTimeout(this.timeouts[d.id || 0]);
      d.visible = false;
      const toasted = this.toasts.findIndex((t: ToastMessage) => t.id === d.id);
      this.toasts.splice(toasted, 1);
    }

    private addToast(d: ToastMessage) {
      if (d) {
        d.visible = true;
        d.duration = d.duration || 2;
        this.toasts.push(d);
        setTimeout(() => {
          const toasted = this.toasts.findIndex((t: ToastMessage) => t.id === d.id);
          if (toasted > -1) {
            this.timeouts[d.id || 0] = setTimeout(() => {
              d.visible = false;
              this.toasts.splice(toasted, 1);
            }, 1000);
          }
        }, d.duration * 1000);
      }
    }

  }
</script>
<style scoped lang="scss">

  #toasts {
    z-index: 10;
    top: 70px;
    right: 1rem;
    display: flex;
    flex-direction: column;
    position: fixed;
    width: 300px;
    max-width: 300px;

    .toast-toast {
      z-index: 10;
      width: 100%;
      color: white;
      padding: 0.8rem;
      font-size: .9rem;
      border-radius: 5px;
      margin-bottom: .5rem;
      box-sizing: border-box;
      background: rgb(45, 132, 164);
      line-height: 1.3rem;

      animation: toast-in .2s ease-in;

      display: flex;

      .toast-icon {
        width: 10%;
        flex-grow: 0;
        display: flex;
        flex-shrink: 0;
        font-size: 1.2rem;
        align-items: center;
        justify-content: center;
      }

      .toast-content {
        padding-left: .5rem;
      }

      &.toast-error {
        background-color: $ipaRed
      }

      &.toast-success {
        background-color: rgb(51, 164, 76);
      }

      @keyframes toast-in {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }

      @keyframes toast-out {
        0% {
          opacity: 1;
        }
        50% {
          opacity: 0;
        }
        100% {
          padding: 0;
          margin: 0;
          height: 0;
        }
      }

      &.toast-hide {
        animation: toast-out .4s ease-out;
        animation-fill-mode: forwards;
        width: 100%;
        overflow: hidden;
      }

      p {
        margin: 0;
      }

      .toast-title {
        font-weight: 600;
        white-space: nowrap;
        text-align: left;
      }

      .toast-message {
        margin-top: 5px;
        color: white;
        text-align: left;
      }
    }
  }
</style>
