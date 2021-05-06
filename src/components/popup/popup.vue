<template>
  <transition name="popup">
    <div id="popup-base"
         :aria-modal="!isIOs"
         aria-labelledby="dialog-label"
         :class="[size, {'no-padding': noPadding, 'mobile-mode': mobileMode}]">
      <div id="popup-overlay"
           ref="popupOverlay"
           class="container"
           @click.stop="closePopup()">
        <div class="popup-content"
             role="dialog"
             @click.stop>
          <div v-if="!noHeader" class="header">
            <h2 v-if="title" id="dialog-label" class="title">{{title}}</h2>

            <slot name="header"></slot>

            <button v-if="closable"
                    title="Close"
                    class="popup-close"
                    @click.stop="closePopup()">
              <uik-icon :icon="['fas', 'times']"></uik-icon>
            </button>
          </div>

          <div class="body">
            <slot name="content"></slot>
          </div>

          <div v-if="!noButtons"
               class="buttons"
               :class="{'no-padding': noButtonsPadding}">
            <slot name="buttons"></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
  import scrollLock from 'scroll-lock';
  import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
  import UikIcon from '../uik-icon.vue';

  @Component({
    components: {
      UikIcon
    }
  })
  export default class UikPopup extends Vue {
    @Prop() title!: string;
    @Prop({default: 'auto'}) size!: 'auto' | 'full' | 'large' | 'medium' | 'small';
    @Prop({default: false}) mobileMode!: boolean;
    @Prop({default: false}) noHeader!: boolean;
    @Prop({default: false}) noPadding!: boolean;
    @Prop({default: false}) noButtons!: boolean;
    @Prop({default: false}) noButtonsPadding!: boolean;
    @Prop({default: true}) closable!: boolean;
    @Prop() focusOnClose!: string;

    private windowScroll: { x: number, y: number } | null = null;
    private bodyOverflow: string | null = null;

    private firstFocus: HTMLElement | null = null;
    private lastFocus: HTMLElement | null = null;

    mounted() {
      // disable body scrolling
      if (this.mobileMode) {
        this.bodyOverflow = document.documentElement.style.overflow;
        document.documentElement.style.overflow = 'hidden';

        this.windowScroll = {
          x: window.scrollX,
          y: window.scrollY
        };
      } else {
        scrollLock.disablePageScroll();
      }

      window.addEventListener('keyup', this.keyupEvents);
      this.trapFocus();
    }

    destroyed() {
      if (this.mobileMode) {
        document.documentElement.style.overflow = this.bodyOverflow!;

        if (this.windowScroll && (this.windowScroll.x !== window.scrollX || this.windowScroll.y !== window.scrollY)) {
          window.scrollTo(this.windowScroll.x, this.windowScroll.y);
        }
      } else {
        scrollLock.enablePageScroll();
      }

      window.removeEventListener('keyup', this.keyupEvents);
    }

    get isIOs() {
      return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    }

    @Emit()
    close() {
    }

    closePopup() {
      if (this.closable) {
        this.close();

        if (this.focusOnClose) {
          Vue.nextTick(() => {
            const e = document.querySelector<HTMLElement>(this.focusOnClose);
            if (e) {
              e.focus();
            }
          });
        }
      }
    }

    private keyupEvents(event: KeyboardEvent) {
      if (event.key === 'Escape' || event.key === 'Esc') {
        this.closePopup();
      }
    }

    private trapFocusFirst(e: KeyboardEvent) {
      if (e.key === 'Tab' && e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        this.lastFocus!.focus();
      }
    }

    private trapFocusLast(e: KeyboardEvent) {
      if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        this.firstFocus!.focus();
      }
    }

    setFocusEvents() {
      // if we already set focus events, remove them
      if (this.firstFocus) {
        this.firstFocus.removeEventListener('keydown', this.trapFocusFirst);
      }
      if (this.lastFocus) {
        this.lastFocus.removeEventListener('keydown', this.trapFocusLast);
      }

      // get the tabbable elements
      const tabbable = this.$el.querySelectorAll<HTMLElement>([
        'input:not([type="hidden"]):not([type="file"]):not([disabled])',
        '*[contenteditable]',
        '*[tabindex="0"]',
        'button:not([disabled])'
      ].join(', '));

      if (tabbable.length === 0) {
        return;
      }

      this.firstFocus = tabbable[0];
      this.lastFocus = tabbable[tabbable.length - 1];

      // when tabbing back from the first element, set focus to the last element
      this.firstFocus.addEventListener('keydown', this.trapFocusFirst);

      // when tabbing forward from the last element, set focus to the first element
      this.lastFocus.addEventListener('keydown', this.trapFocusLast);
    }

    private trapFocus() {
      this.setFocusEvents();

      // set focus to the first relevant element
      let firstToFocus: HTMLElement | null = (
        this.$el.querySelector('input:not([type="hidden"]):not([type="file"]):not([disabled])') ||
        this.$el.querySelector('*[contenteditable]') ||
        this.$el.querySelector('*[tabindex="0"]') ||
        this.$el.querySelector('button:not(.popup-close):not([disabled])')
      );

      if (firstToFocus) {
        firstToFocus.focus();
      }
    }
  }
</script>

<style lang="scss" scoped>

  #popup-base {
    z-index: 1000;
    transition: opacity 0.3s ease;

    .container {
      content: ' ';
      display: flex;
      align-items: center;
      justify-content: center;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(black, 0.5);
      z-index: 1000;
    }

    .popup-content {
      display: flex;
      flex-direction: column;
      position: relative;
      max-width: 90vw;
      max-height: 90vh;
      border-radius: 3px;
      background: white;
      overflow: hidden;
      transition: all 0.3s ease;

      .title {
        flex: 1 auto;
        font-size: 1rem;
        margin: 0;
        padding: 0;
        font-weight: 600;
      }

      .header {
        flex: auto 0;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        min-height: 52px;
        padding: 0 1rem;
        border-bottom: 1px solid #eeeeee;
        color: $dark;
        font-size: 1rem;
        font-weight: 600;

        .popup-close {
          margin-right: -0.3rem;
          padding: 0.3rem;
          border: none;
          background: transparent;
          color: $dark;
          cursor: pointer;

          &:hover {
            opacity: 0.5;
          }
        }
      }

      .body {
        flex: 1 0;
        min-height: 0;
        padding: 1rem;
        font-size: .9rem;
      }

      .buttons {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        width: 100%;
        padding: 1rem 1.5rem;
        box-sizing: border-box;

        ::v-deep > button {
          margin: 0 .25rem;

          &:first-of-type {
            margin-left: 0;
          }

          &:last-of-type {
            margin-right: 0;
          }
        }

        ::v-deep > div {
          width: 100%;
          display: flex;
          justify-content: flex-end;

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

        &.no-padding {
          padding: 0;
        }
      }
    }

    &.no-padding {
      .popup-content {
        .body {
          padding: 0;
        }
      }
    }

    &:not(.mobile-mode) {
      &.full {
        .popup-content {
          width: 90vw;
          height: 90vh;
        }
      }

      &.large {
        .popup-content {
          width: 68.75rem;
        }
      }

      &.medium {
        .popup-content {
          width: 48.75rem;
        }
      }

      &.small {
        .popup-content {
          width: 36.25rem;
        }
      }
    }

    &.mobile-mode {
      .container {
        // make sure popups starts from the top of the page on mobile
        justify-content: flex-start;
        align-items: flex-start;
      }

      .popup-content {
        width: 100vw;
        // 56px is android and ios nav bar height, vh includes this so we have to remove it :(
        height: calc(100vh - 56px);
        max-width: 100vw;
        max-height: 100vh;
        border-radius: 0;
      }
    }
  }

  .popup-enter,
  .popup-leave-active {
    opacity: 0;

    .popup-content {
      transform: scale(1.05);
    }
  }
</style>
