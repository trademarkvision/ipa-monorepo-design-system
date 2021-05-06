<template lang="html">
  <div class="v-autocomplete">
    <div class="v-autocomplete-input-group" :class="{'v-autocomplete-selected': value}">
      <input type="text" v-model="searchText"
             :placeholder="placeholder"
             :disabled="disabled"
             autocomplete="off"
             :name="inputAttrs.name"
             :style="inputAttrs.style"
             :id="inputAttrs.id"
             :accesskey="inputAttrs.accesskey"
             @paste="paste"
             @blur="blur"
             @focus="focus"
             @input="inputChange"
             @keydown.enter="keyEnter"
             @keydown.tab="keyEnter"
             @keydown.up="keyUp"
             @keydown.down="keyDown">
    </div>
    <div class="v-autocomplete-list" v-if="show"
         @click.prevent.stop="keyEnter">
      <div class="v-autocomplete-list-item"
           v-for="(item, i) in items"
           :class="{'v-autocomplete-item-active': i === cursor}" @mouseover="cursor = i">
        <div>{{item}}</div>
      </div>
      <div class="v-autocomplete-list-item no-item"
           v-if="showNoItems">
        {{searching ? 'Searching...' : 'No results found'}}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Prop, Watch} from 'vue-property-decorator';

  @Component({})
  export default class Autocomplete extends Vue {

    @Prop({default: 3}) minLen!: number;
    @Prop({default: 10}) wait!: number;
    @Prop() value!: string;
    @Prop({default: () => []}) items!: string[];
    @Prop({default: ""}) placeholder!: string;
    @Prop({default: {name: ""}}) inputAttrs!: { name: string };
    @Prop({default: false}) disabled!: boolean;
    @Prop({default: false}) keepOpen!: boolean;
    @Prop({default: false}) searching!: boolean;

    searchText = '';
    showList = false;
    cursor = -1;
    timeout?: number = undefined;
    justFocus = false;

    get hasItems() {
      return !!this.items.length
    }

    get show() {
      return (this.showList && this.hasItems) || this.keepOpen || this.showNoItems;
    }

    get showNoItems() {
      return !this.hasItems &&
        this.searchText.length >= this.minLen &&
        this.showList &&
        !this.justFocus &&
        !this.searchText.match(/[*+?]/)
    }

    @Watch('value')
    valueWatch(newValue: string) {
      if (!this.isSelectedValue(newValue)) {
        this.onSelectItem(newValue);
        this.searchText = newValue;
      }
    }

    @Watch('searchText')
    searchTextWatch() {
      if (this.searchText.match(/\*\?/)) this.showList = false;
    }

    created() {
      this.onSelectItem(this.value)
    }

    inputChange() {
      this.justFocus = false;
      this.showList = true;
      this.cursor = -1;
      this.onSelectItem(null);
      this.callUpdateItems(this.searchText, this.updateItems);
      this.$emit('change', this.searchText);
    }

    updateItems() {
      this.$emit('update-items', this.searchText)
    }

    focus() {
      this.$emit('focus', this.searchText);
      this.showList = true;
      this.justFocus = true;
    }

    blur() {
      this.$emit('blur', this.searchText);
      setTimeout(() => {
        this.showList = false;
      }, 200);
    }

    paste(e: any) {
      this.$emit('paste', e);
    }

    onSelectItem(item: string | null) {
      if (item) {
        this.searchText = item;
        this.$emit('item-selected', item);
      }
      this.$emit('input', item)
    }

    isSelectedValue(value: string) {
      return 1 == this.items.length && value == this.items[0]
    }

    keyUp() {
      if (this.cursor > -1) {
        this.cursor--;
        this.itemView(this.$el.getElementsByClassName('v-autocomplete-list-item')[this.cursor])
      }
    }

    keyDown() {
      if (this.cursor < this.items.length) {
        this.cursor++;
        this.itemView(this.$el.getElementsByClassName('v-autocomplete-list-item')[this.cursor])
      }
    }

    itemView(item: Element) {
      if (item && item.scrollIntoView) {
        item.scrollIntoView(false)
      }
    }

    keyEnter(e: KeyboardEvent) {
      if (this.showList && this.items[this.cursor]) {
        if (e.key === 'Enter') {
          e.stopPropagation();
          e.preventDefault();
        }

        this.onSelectItem(this.items[this.cursor]);
        this.showList = false
      }
    }

    isUpdateItems(text: string) {
      if (text.length >= this.minLen) {
        return true
      }
    }

    callUpdateItems(text: string, cb: any) {
      clearTimeout(this.timeout);
      if (this.isUpdateItems(text)) {
        this.timeout = setTimeout(cb, this.wait) as any;
      }
    }

  }
</script>
<style scoped lang="scss">

  .v-autocomplete {
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;

    .v-autocomplete-input-group {
      display: flex;
      height: 100%;
    }

    .v-autocomplete-list {
      top: 40px;
      width: auto;
      min-width: calc(100% - .5rem);
      z-index: 100;
      padding: .25rem;
      background: white;
      position: absolute;
      max-height: 400px;
      overflow-y: auto;
      overflow-x: hidden;

      .v-autocomplete-list-item {
        cursor: pointer;
        padding: .5rem;

        &.v-autocomplete-item-active {
          color: white;
          background: $ipaCharcoal;
        }

        &.no-item {
          opacity: .8;
          width: 150px;
          font-size: .9rem;
        }
      }
    }
  }

</style>
