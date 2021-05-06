<template lang="html">
  <font-awesome-icon class="uik-icon" :icon="icon" :role="role" :spin="spin" :size="size" :rotation="rotation"></font-awesome-icon>
</template>
<script lang="ts">
  import Vue from "vue";
  import {Component, Prop} from "vue-property-decorator";
  import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';

  @Component({
    components: {
      FontAwesomeIcon
    }
  })
  export default class UikIcon extends Vue {
    @Prop({default: 'presentation'}) role!: string;
    @Prop() icon!: Object | Array<string> | string;
    @Prop() spin!: boolean;
    @Prop() size!: string;
    @Prop() rotation!: number;
  }
</script>
<style lang="scss"></style>
