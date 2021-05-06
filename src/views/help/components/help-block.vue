<template lang="html">
  <div class="flex-content-container box-with-shadow">
    <div class="flex-columns">
      <div class="w-50">
        <h2>{{title}}</h2>
      </div>
    </div>
    <div class="flex-columns">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Prop} from 'vue-property-decorator';

  @Component({})
  export default class HelpBlock extends Vue {
    @Prop({default: 'Help'}) title!: string;
  }
</script>

<style scoped lang="scss">
  .box-with-shadow {
    background-color: #FFFFFF;
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.12);
    display: block !important;
    font-family: 'Open-Sans', sans-serif;
    margin: 1rem auto;
    max-width: 73.5rem;
    padding: 2rem;
    position: relative;
    width: 100%;
  }

  .box-with-shadow {
    background-color: #FFFFFF;
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.12);
    display: block !important;
    font-family: 'Open-Sans', sans-serif;
    margin: 1rem auto;
    max-width: 73.5rem;
    padding: 2rem;
    position: relative;
    width: 100%;
  }

  .close-btn {
    position: absolute;
    right: 1rem;
    top: 1rem;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 200;
    margin-top: 0;
    margin-bottom: 0;
  }

  h3 {
    font-size: 1rem;
    font-weight: bold;
    color: #666666;
  }

  h5 {
    margin: 0;
  }

  .key {
    border: 1px solid #666666;
    border-radius: 0.25rem;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1);
    color: #666666;
    display: inline-block;
    font-size: 14px;
    height: 2rem;
    line-height: 2rem;
    text-align: center;
    min-width: 2rem;

    &.plus {
      font-size: 1.1rem;
      line-height: 30px;
    }

    &.alt {
      width: 44px;
    }

    &.enter {
      width: 84px;
    }

    &.tab {
      width: 50px;
    }

    &.space-bar {
      width: 160px;
    }
  }

  .shortcut {
    margin: 0.5rem 0;
  }

  .padding-left-right {
    padding: 0 0.25rem;
  }

  .explanation {
    margin-left: 0.5rem;
    font-size: 0.9rem;
  }

  .shortcut {
    margin: 0.5rem 0;
  }

  .pref-desc {
    margin: 0.1rem 0 0 0.5rem;
  }

  .right-align {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }

  .rel-pos {
    position: relative;
  }

  .abs-pos {
    position: absolute;
    top: 2rem;
    right: 2rem;
    margin: 0;
  }

  .no-pad {
    padding: 0;
  }

  .header-margin {
    margin: 1.5rem 0 0.5rem;
  }

  .bottom-padding {
    margin-bottom: 1.5rem;
  }
</style>
