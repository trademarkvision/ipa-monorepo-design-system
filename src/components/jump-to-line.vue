<template lang="html">
  <div id="jumpToLine" :class="active ? 'active' : ''">
    <form action="#">
      <label for="recordLineNumberField">Select row number</label>
      <input id="recordLineNumberField"
             v-model="line"
             autocomplete="off"
             title="Select row number"
             @keydown.enter.prevent.stop="jumpTo($event)"
             @keydown.esc.prevent.stop="close()"
             placeholder="Select row number" type="text">
      <span class="error" v-if="error">{{error}}</span>
    </form>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Prop, Watch} from 'vue-property-decorator';

  @Component({})
  export default class JumpToLine extends Vue {
    @Prop() lineQuery!: string;

    line: string = '';
    active: boolean = false;
    error: string = '';
    lastFocus: HTMLElement | null = null;

    beforeCreate() {
      window.addEventListener('keydown', (ev: KeyboardEvent) => {

        if (ev.ctrlKey || ev.shiftKey || ev.metaKey) return;

        const input = (ev as any).path.filter((x: HTMLElement) => (x.nodeName === 'INPUT' || x.nodeName === 'TEXTAREA' || x.contentEditable === 'true'));

        if (input.length === 0 && ev.key === 'j' || ev.key === 'j' && ev.altKey) {
          ev.stopPropagation();
          ev.preventDefault();
          this.lastFocus = document.activeElement as HTMLElement;
          this.active = true;
        }
      });
    }

    @Watch('active')
    showHide() {
      if (this.active) {
        (<HTMLInputElement>this.$el.querySelector('input')).focus();
      }
    }

    @Watch('line')
    lineUpdate() {

      if (!this.line || this.line.length === 1 && isNaN(Number(this.line[0]))) return;

      if (this.lineQuery) {
        const el = document.querySelector(this.lineQuery.replace('LINE_NUMBER', this.line.toUpperCase())) as HTMLElement;
        if (!el) this.error = `Line number ${this.line} not found`;
        else this.error = '';
      }
      else {
        this.error = '';
      }
    }

    jumpTo(e: KeyboardEvent) {

      e.stopImmediatePropagation();

      this.$emit('jump-to', this.line);

      if (this.lineQuery) {
        const el = document.querySelector(this.lineQuery.replace('LINE_NUMBER', this.line.toUpperCase())) as HTMLElement;
        if (el) el.focus();
        else this.error = `Line number ${this.line} not found`;
      }

      if (!this.error) {
        this.active = false;
        this.line = '';
      }
    }

    close() {
      this.active = false;
      this.line = '';
      if (this.lastFocus) {
        this.lastFocus.focus();
      }
      else {
        document.body.focus();
      }
    }

  }
</script>

<style scoped lang="scss">
  #jumpToLine {
    transition: opacity .2s ease;
    position: fixed;
    width: 200px;
    margin-left: -110px;
    background: #ffffff;
    padding: 20px;
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, .2) 0 0 3px;
    top: 50vh;
    z-index: 1000;
    left: -99999px;
    opacity: 0;

    &.active {
      left: 50%;
      opacity: 1;
    }

    label {
      display: none;
      text-align: center;
    }

    input[type="text"] {
      border: 1px solid #b3b3b3;
      border-radius: 3px;
      font-size: .9rem;
      padding: 6px;
      width: 100%;
      box-sizing: border-box;
      text-align: center;
    }

    .error {
      color: darkred;
      display: block;
      width: 100%;
      margin-top: .5rem;
      font-weight: bold;
      font-size: .8rem;
      text-align: center;
    }
  }
</style>
