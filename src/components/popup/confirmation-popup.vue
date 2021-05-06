<template lang="html">
  <popup-base :closable="hideClose !== true" :title="title ? title : 'Please confirm'" classes="smaller">
    <div slot="content">
      <div id="confirmationPopup">
        <div class="message-content">
          <slot name="message"></slot>
        </div>
      </div>
    </div>
    <div slot="buttons">
      <div class="left"></div>
      <div class="right">
        <form class="center-align" @submit.prevent="confirmPopup()">
          <button v-if="hideClose !== true" type="button"
                  class="qa-confirmationpopup-button-cancel fill grey"
                  @click.prevent="closePopup()">
            {{cancelLabel ? cancelLabel : 'Cancel'}}
          </button>
          <button class="qa-button-confirm" :class="confirmButtonClass"
                  type="submit" v-if="hideConfirm !== true">
            {{confirmButtonLabel}}
          </button>
        </form>
      </div>
    </div>
  </popup-base>
</template>
<script lang="ts">
  import Vue from 'vue';
  import {Component, Prop} from 'vue-property-decorator';

  import PopupBase from "./popup-base.vue";

  @Component({
    components: {
      PopupBase
    }
  })

  export default class ConfirmationPopup extends Vue {
    @Prop() title!: string;
    @Prop() confirmButtonLabel!: string;
    @Prop() cancelLabel!: string;
    @Prop() hideConfirm!: boolean;
    @Prop() hideClose!: boolean;
    @Prop({default: "fill red"}) confirmButtonClass!: string;

    mounted() {
      Vue.nextTick(() => {
        let e = document.querySelector('*[tabindex="0"]') as HTMLElement;
        if (e) e.focus();
      });
    }

    private closePopup() {
      this.$emit('close');
    }

    private confirmPopup() {
      this.$emit('confirm');
    }

  }

</script>
<style lang="scss">

  #preferences-popup {
    .grid-100.no-padding {
      margin-top: 1rem;
    }
  }

  #confirmationPopup {
    .message-content {
      font-size: .9rem;
    }
    p {
      font-weight: 400;
      margin-top: 0;
      text-align: left;
      width: calc(100% - 4rem);
    }
    form {
      text-align: center;
    }

  }
</style>
