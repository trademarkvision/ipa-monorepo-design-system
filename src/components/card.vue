<template lang="html">
  <div class="card">
    <div class="card-header">
      <div>
        <uik-icon :icon="iconTitle"/>
        <span class="bump-right">{{title}}</span>
      </div>
      <div v-if="externalLink">
        <uik-icon :icon="['fas', 'external-link-alt']"/>
      </div>
    </div>

    <div class="card-content">
      <slot name="card-content"></slot>
    </div>

    <div class="card-footer" v-if="showFooter">
      <slot name="card-footer">
        <uik-icon :icon="iconFooter"></uik-icon>
        <span class="bump-right">{{footerText}}</span>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import {Component, Prop} from "vue-property-decorator";
  import UikIcon from "./uik-icon.vue";

  @Component({
    components: {
      UikIcon,
    },
  })
  export default class Card extends Vue {
    // Header
    @Prop({default: () => ['fas', 'search']}) iconTitle!: Array<string>;
    @Prop({default: "Title"}) title!: string;
    @Prop({default: true}) externalLink!: boolean;

    // Footer
    @Prop({default: true}) showFooter!: boolean;
    @Prop({default: () => ['fas', 'arrow-right']}) iconFooter!: Array<string>;
    @Prop({default: "Footer"}) footerText!: string;
  }
</script>

<style scoped lang="scss">
  @import "../../styles/components/cards";

  .card {
    background-color: $white;
    color: $dark;
    display: flex;
    flex-direction: column;

    &:hover {
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    }

    .bump-right {
      margin-left: 0.5rem;
    }

    .card-header {
      background-color: $primary;
      border-bottom: 0;
      border-radius: $borderRadius $borderRadius 0 0;
      color: #FFFFFF;
      cursor: pointer;
      display: flex;
      font-size: 1rem;
      font-weight: bold;
      justify-content: space-between;
      line-height: 3.5rem;
      height: 3.5rem;
      padding: 0 1rem;
    }

    .card-content {
      cursor: pointer;
      display: block;
      font-size: 1rem;
      padding: 1.5rem 40px 0;

      .bold {
        font-weight: bold;
        margin-left: 0.25rem;
      }

      .smaller-text {
        font-size: 0.9rem;
        margin-bottom: 1rem;
      }
    }

    .card-footer {
      border-top: 1px solid #EAEAEA;
      color: $darkGrey;
      cursor: pointer;
      font-size: 0.9rem;
      height: 2.5rem;
      justify-content: center;
      line-height: 2.5rem;
      transition: all 0.3s ease;
      width: 100%;

      &:hover {
        background-color: $lightGrey;
      }

      div {
        padding-left: 1rem;

        span {
          margin-left: 0.5rem;
        }
      }
    }
  }
</style>
