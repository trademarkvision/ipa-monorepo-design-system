<template lang="html">
  <div id="popupBase" :class="classes">
    <div class="container" id="popupOverlay" @click="closePopup($event)">
      <div class="content">
        <div class="header" v-if="showHead">
          <span>{{title}}</span>

          <button class="qa-close-popup" @click="popupClose()" v-if="closable !== false">
            <font-awesome-icon :icon="['fas', 'times']"></font-awesome-icon>
          </button>
        </div>

        <div class="body">
          <slot name="content"/>
        </div>

        <div v-if="showButtons" class="buttons">
          <slot name="buttons"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import Vue from 'vue';
  import {Component, Prop} from 'vue-property-decorator';

  @Component({
    components: {}
  })
  export default class BasePopupBase extends Vue {

    @Prop({default: true}) showHead!: boolean;
    @Prop() closable!: boolean;
    @Prop() title!: string;
    @Prop() classes!: string;
    @Prop({default: true}) showButtons!: boolean;
    @Prop() closeArgs!: any;

    private lockScroll: number = -1;

    created() {
      window.addEventListener('keyup', (x: KeyboardEvent) => {
        if (x.keyCode === 27) {
          this.popupClose();
        }
      });
      window.addEventListener('scroll', () => {
        if (this.lockScroll > -1) {
          window.scrollTo(window.scrollX, this.lockScroll);
          this.lockScroll = -1;
        }
      });
    }

    mounted() {
      Vue.nextTick(() => {

        let e: any = this.$el.querySelector('input');
        if (e) {
          e.focus();
        } else {
          e = this.$el.querySelector('*[contenteditable]');
          if (e) {
            e.focus();
          } else {
            e = this.$el.querySelector('button');
            if (e) e.focus();
          }
        }

        const x = document.getElementById("popupOverlay");
        if (x) {
          this.lockScroll = window.scrollY;
        }

      });
    }

    popupClose() {
      if (this.closable !== false) {
        this.$parent.$emit('close', this.closeArgs);
      }
    }

    closePopup(ev: Event) {
      if ((<HTMLDivElement>ev.target).id === 'popupOverlay') {
        this.popupClose();
      }
    }

  }
</script>

<style lang="scss">

  #popupBase {

    .container {
      top: 0;
      left: 0;
      z-index: 999999;
      width: 100vw;
      height: 100vh;
      position: fixed;
      background: rgba(black, .5);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .buttons {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding: 1rem 40px;
      width: calc(100% - 80px);

      button {
        margin: 0 .25rem;

        &:first-of-type {
          margin-left: 0;
        }

        &:last-of-type {
          margin-right: 0;
        }
      }

      & > div {
        width: 100%;
        display: flex;

        .left {
          display: flex;
          justify-content: flex-start;
          width: 50%;
        }

        .right {
          display: flex;
          justify-content: flex-end;
          width: 50%;
        }
      }
    }

    &.large {
      .content {
        width: 1100px;
      }
    }

    &.small {
      .content {
        width: 950px;
      }
    }

    &.smaller {
      .content {
        width: 780px;
      }
    }

    .content {
      background: white;
      border-radius: 3px;
      overflow: visible;
      display: flex;
      flex-direction: column;
      max-height: 90vh;
      max-width: 90vw;

      .flex-content-container {
        min-width: 100%;
      }

      .header {
        height: 52px;
        line-height: 52px;
        color: $ipaCharcoal;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex-shrink: 0;
        border-bottom: 1px solid #EEE;
        font-size: 1rem;
        font-weight: 600;
        padding: 0 1rem;
        border-radius: 3px 3px 0 0;

        span {
          display: flex;
          flex-grow: 1;
          font-size: 1rem;
        }

        button {
          border: none;
          box-shadow: none;
          background: transparent;
          cursor: pointer;
          color: $ipaCharcoal;
          padding: .3rem 0 0.3rem 0.3rem;

          &.qa-close-popup {
            transition: all 0.3s ease;

            &:hover {
              cursor: pointer;
              opacity: 0.5;
            }
          }
        }
      }

      .body {
        padding: 1rem 40px 0.5rem;
      }

      input[type='text'] {
        padding: 0 .5rem !important;
        width: 70%;
      }
    }
  }
</style>
