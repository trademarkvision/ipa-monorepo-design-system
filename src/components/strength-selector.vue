<template lang="html">
  <div class="strength-selector">
    <h4 v-if="showTitle">Issue strength</h4>
    <select v-model="current">
      <option v-for="s in strengthList">
        {{s}}
      </option>
    </select>
  </div>
</template>
<script lang="ts">
  import Vue from 'vue';
  import {Component, Prop, Watch} from 'vue-property-decorator';
  import Multiselect from 'vue-multiselect-ipa';

  @Component({
    components: {
      Multiselect,
    },
  })
  export default class StrengthSelector extends Vue {

    strengthList: string[] = [
      's41(3)',
      's41(4)',
      's41(3) & s41(4)',
      's41(5)',
      's41(6)'
    ];

    @Prop({default: 's41(4)'}) selected!: string;
    @Prop({default: false}) showTitle!: boolean;

    current: string = "";

    created() {
      this.current = this.selected || 's41(4)';
    }

    @Watch('current', {immediate: false})
    select(oldValue: string, newValue: string) {
      if (oldValue !== newValue && this.current !== this.selected) {
        this.$emit('select', this.current);
      }
    }

  }

</script>
<style scoped lang="scss">
  .strength-selector {
    margin-bottom: .4rem;
    h4 {
      margin-bottom: .3rem !important;
      font-size: 0.9rem;
      font-weight: 600;
    }
    font-size: 0.9rem;

    select {
      border-radius: 5px;
      border: 1px solid #E8E8E8;
      background: #FFF;
      display: block;
      font-size: 14.4px;
      height: 40px;
      padding: 8px 40px 0 8px;
      width: 100%;
    }
  }

  button {
    width: 35px;
    padding: 0;
    height: 35px;
    margin: 0 .2rem;
    &:first-of-type {
      margin-left: 0;
    }
    &:last-of-type {
      margin-right: 0;
    }
    &.selected {
      background: #4B6196;
      color: white;
    }
  }
</style>
