<template lang="html">
  <popup-base @click.prevent.stop :closable="true" :title="title" classes="small issues-popup">

    <div slot="content" id="issuesPopup">
      <div class="flex-content-container issues-container" v-if="selectedIssue === null">
        <div class="flex-columns typing">
          <input type="text"
                 accesskey="."
                 placeholder="Start typing to search for an issue"
                 v-model="filter">
        </div>
        <div class="flex-columns">
          <div class="w-25 left">
            <ul>
              <li v-for="(x, i) in currentGroups"
                  class="group"
                  :data-group="x.groupName"
                  :data-group-index="i"
                  @keydown.up.down.stop.prevent="moveUpDown($event, 'group', i, currentGroups.length)"
                  @keydown.right.stop.prevent="goToFirstSubGroupOrItem()"
                  :class="{
                    'disabled': isDisabled(x.groupName),
                    'active': currentGroup && currentGroup.groupName === x.groupName || currentIssuesGroup && currentIssuesGroup.groupName === x.groupName
                  }"
                  :tabindex="0"
                  @click.stop.prevent="selectGroup(x.groupName)"
                  @keydown.enter.stop.prevent="selectGroup(x.groupName)"
              >
                {{ x.description }}
              </li>
            </ul>
          </div>
          <div class="w-30 middle" v-if="hasSubGroups">
            <ul>
              <li v-for="(x, i) in  currentGroup.subGroup"
                  tabindex="-1"
                  class="sub-group"
                  :class="{
                    'active': currentIssuesGroup != null && currentIssuesGroup.groupName === x.groupName,
                    'disabled': isDisabled(x.groupName),
                  }"
                  :data-sub-group="x.groupName"
                  :data-sub-group-index="i"
                  @keydown.up.down.stop.prevent="moveUpDown($event, 'sub-group', i, currentGroup.subGroup.length)"
                  @keydown.left.stop.prevent="goToParentGroup()"
                  @keydown.right.stop.prevent="goToFirstItem()"
                  @click.stop.prevent="selectSubGroup(x.groupName)"
                  @keydown.enter.stop.prevent="selectSubGroup(x.groupName)">
                {{ x.description }}
              </li>
            </ul>
          </div>
          <div class="right" :class="{'w-75': !hasSubGroups, 'w-45': hasSubGroups}"
               v-if="currentIssuesGroup != null && currentIssuesGroup.issues.length">
            <ul>
              <li v-for="(x, i) in currentIssuesGroup.issues"
                  class="item"
                  :class="{
                    'disabled': isDisabled(x.issue),
                  }"
                  :data-item="x.issue"
                  :data-item-index="i"
                  @keydown.up.down.stop.prevent="moveUpDown($event, 'item', i, currentIssuesGroup.issues.length)"
                  @keydown.left.stop.prevent="goToSubGroupOrGroup()"
                  @click.stop.prevent="selectIssue(x)"
                  @keydown.enter.stop.prevent="selectIssue(x)"
                  tabindex="0">
                {{ x.description }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="flex-content-container issues-container" v-if="selectedIssue !== null && withComment">
        <div class="flex-columns selected-pills">
          <div class="pill-left w-20">
            {{ getGroup(selectedIssue).group.description }}
          </div>
          <div class="pill-left w-30" style="padding: 0 0 0 0.5rem;" v-if="getGroup(selectedIssue).subGroup">
            {{ getGroup(selectedIssue).subGroup.description }}
          </div>
          <div class="pill-right"
               :class="{'w-80': !getGroup(selectedIssue).subGroup, 'w-50': getGroup(selectedIssue).subGroup}">
            {{ selectedIssueWithData.description }}
          </div>
        </div>
        <div class="flex-columns">
          <div class="w-100 comment-container" accesskey="n">
            <strength-selector :selected="strength" @select="selectStrength"
                               :show-title="true"
                               v-if="getGroup(selectedIssue).group.description.indexOf('41') > -1"></strength-selector>
            <h4>Working notes</h4>
            <wysiwyg v-model="issueComment" type="text"
                     placeholder="Enter working notes..."
                     maxlength="100" ref="textInput" :tabindex="0"></wysiwyg>
          </div>
        </div>
      </div>
    </div>

    <div slot="buttons" v-if="selectedIssue !== null && withComment">
      <div class="left">
        <button class="grey fill" @click.prevent="selectedIssue = null">Back</button>
      </div>
      <div class="right">
        <button class="qa-popup-cancel grey fill" @click.prevent="close()">Cancel</button>
        <button class="qa-popup-save green fill" @click.prevent="commitIssue()">Save</button>
      </div>
    </div>

  </popup-base>
</template>
<script lang="ts">
  import Vue from 'vue';
  import { Component, Prop, Watch } from 'vue-property-decorator';
  import wysiwyg from "vue-wysiwyg-2";

  import PopupBase from "./popup-base.vue";
  import StrengthSelector from "../../../src/components/strength-selector.vue";

  import { CommonUtils } from "../../../src/utils/commonUtils";
  import { wysiwygBaseOptions } from "../../../src/utils/wysiwygBaseOptions";
  import { PopupIssue, PopupIssueDTO, PopupIssueGroup } from "../../../src/models/issues";

  Vue.use(wysiwyg, wysiwygBaseOptions);

  @Component({
    components: {
      PopupBase,
      StrengthSelector
    },
  })
  export default class IssuesPopup extends Vue {

    currentGroups: PopupIssueGroup[] = [];
    currentGroup: PopupIssueGroup | null | undefined = null;
    currentIssuesGroup: PopupIssueGroup | null | undefined = null;

    issue: string | null = null;
    comment: string = "";
    filter: string = "";
    strength: string | null = null;
    selectedStrength: string = "";

    @Prop({default: true}) showCommonIssues!: boolean;
    @Prop() appIssues!: string[];
    @Prop() disabledIssues!: string[] | null;
    @Prop() startIssue!: PopupIssueDTO;
    @Prop() tmType!: string;
    @Prop({default: true}) withComment!: boolean;
    @Prop({default: 'Raise new issue'}) title!: string;

    created() {
      this.disabledIssues = this.disabledIssues || [];
      this.currentGroups = CommonUtils.issuesData(this.appIssues, this.allIssues);
      this.currentGroup = this.currentGroups[0];
      this.currentIssuesGroup = this.currentGroup.issues ? this.currentGroup : this.currentGroup.subGroup ? this.currentGroup.subGroup[0] : null;

      if (this.startIssue) {
        this.doSelectIssue({issue: this.startIssue.issue, strength: this.startIssue.strength});
        this.issueComment = this.startIssue.comment;
      }
    }

    goToFirstSubGroupOrItem() {
      const subGroups = document.querySelectorAll('li.sub-group');
      if (subGroups.length > 0) {
        const subGroup = document.querySelector(`li[data-sub-group="${this.currentIssuesGroup!.groupName}"]`);
        if (subGroup) {
          (subGroup as HTMLUListElement).focus();
        } else {
          (subGroups[0] as HTMLUListElement).focus();
        }
      } else {
        const items = document.querySelectorAll('li.item');
        if (items.length > 0) {
          (items[0] as HTMLUListElement).focus();
        }
      }
    }

    goToParentGroup() {
      const subGroups = document.querySelector(`li[data-group="${this.currentGroup!.groupName}"]`);
      if (subGroups) {
        (subGroups as HTMLUListElement).focus();
      }
    }

    goToFirstItem() {
      const items = document.querySelectorAll('li.item');
      if (items.length > 0) {
        (items[0] as HTMLUListElement).focus();
      }
    }

    goToSubGroupOrGroup() {
      const subGroup = document.querySelector(`li[data-sub-group="${this.currentIssuesGroup!.groupName}"]`);
      if (subGroup) {
        (subGroup as HTMLUListElement).focus();
      } else {
        const group = document.querySelector(`li[data-group="${this.currentIssuesGroup!.groupName}"]`);
        if (group) {
          (group as HTMLUListElement).focus();
        }
      }
    }

    moveUpDown(e: KeyboardEvent, what: string, current: number, total: number) {

      const op = e.key === "ArrowUp" ? -1 : 1;

      if (op === 1 && current + op < total) {
        const next = document.querySelector(`li[data-${what}-index="${current + op}"]`);
        if (next) {
          (next as HTMLUListElement).focus();
          if (what !== 'item') (next as HTMLUListElement).click();
        }
      } else if (op === -1 && current + op >= 0) {
        const next = document.querySelector(`li[data-${what}-index="${current + op}"]`);
        if (next) {
          (next as HTMLUListElement).focus();
          if (what !== 'item') (next as HTMLUListElement).click();
        }
      } else {
        const next = document.querySelector(`li[data-${what}-index="${total - 1}"]`);
        if (next) {
          (next as HTMLUListElement).focus();
          if (what !== 'item') (next as HTMLUListElement).click();
        }
      }

    }

    isDisabled(groupName: string): boolean {
      if (this.disabledIssues == null) return false;
      return this.disabledIssues.indexOf(groupName) !== -1;
    }

    get allIssues() {
      const x = (window as any).ISSUES || [];
      if (!this.showCommonIssues) {
        return x.filter((k: any) => k.groupName !== "R-TMA-0");
      }
      return x;
    }

    get issueComment(): string {
      return this.comment;
    }

    set issueComment(c: string) {
      this.comment = c;
    }

    get selectedIssue(): string | null {
      return this.issue;
    }

    set selectedIssue(issue: string | null) {
      this.issue = issue;
    }

    get selectedIssueWithData() {
      if (this.currentGroup) {
        return this.currentGroup.issues ?
          this.currentGroup.issues.filter(x => x.issue === this.selectedIssue)[0] : {};
      } else {
        return this.currentIssuesGroup && this.currentIssuesGroup.issues ?
          this.currentIssuesGroup.issues.filter(x => x.issue === this.selectedIssue)[0] : {};
      }
    }

    @Watch('filter')
    updateFilteredGroups() {
      let searchString = this.filter.toUpperCase();
      if (this.filter.length > 2) {
        const r: PopupIssueGroup[] = [];
        CommonUtils.issuesData(this.appIssues, this.allIssues).forEach((g: PopupIssueGroup) => {
          if (g.issues && g.issues.length) {
            let filtered = g.issues.filter(i => i.description.toUpperCase().indexOf(searchString) > -1);
            if (filtered.length) {
              r.push({
                groupName: g.groupName,
                description: g.description,
                issues: filtered
              });
            }
          } else if (g.subGroup) {
            const filteredSubGroups: PopupIssueGroup[] = [];
            g.subGroup.forEach(x => {
              if (x.issues) {
                let filtered = x.issues.filter(i => i.description.toUpperCase().indexOf(searchString) > -1);
                if (filtered.length) {
                  filteredSubGroups.push({
                    groupName: x.groupName,
                    description: x.description,
                    issues: filtered
                  });
                }
              }
            });
            if (filteredSubGroups.length) {
              r.push({
                groupName: g.groupName,
                description: g.description,
                subGroup: filteredSubGroups,
              });
            }
          }
        });
        this.currentGroups = r;
        if (this.currentGroups[0] !== null && !(this.currentGroups[0] === undefined)) {
          this.selectGroup(this.currentGroups[0].groupName);
        }
      } else {
        this.currentGroups = CommonUtils.issuesData(this.appIssues, this.allIssues);
        this.currentGroup = this.currentGroups[0];
        this.currentIssuesGroup = this.currentGroup.issues ? this.currentGroup : this.currentGroup.subGroup ? this.currentGroup.subGroup[0] : null;
      }
    }

    get hasSubGroups() {
      return (this.currentGroup && this.currentGroup.subGroup && this.currentGroup.subGroup.length);
    }

    selectIssue(x: PopupIssue) {
      if (this.isDisabled(x.issue)) return;
      this.doSelectIssue({issue: x.issue, strength: x.strength});
    }

    selectStrength(s: string) {
      this.selectedStrength = s;
    }

    /**
     * Sets the selectedIssue, along with associated data
     */
    doSelectIssue(issue: { issue: string, strength: boolean | string | null } | null | undefined) {
      this.selectedIssue = issue ? issue.issue : null;
      if (issue) {
        let groupDescription = "";
        this.issueComment = '';
        this.currentGroup = null;
        this.currentGroups.forEach(g => {
          if (g.issues) {
            g.issues.forEach(i => {
              if (i.issue == issue.issue) {
                this.currentGroup = g;
                groupDescription = g.description;
              }
            })
          }
        });
        if (groupDescription.indexOf('41') > -1) {
          this.strength = typeof issue.strength === 'boolean' ? 's41(4)' : (issue.strength as string);
          this.selectedStrength = typeof issue.strength === 'boolean' ? 's41(4)' : (issue.strength as string);
        } else {
          this.strength = '';
          this.selectedStrength = '';
        }
      } else {
        this.strength = null;
        this.issueComment = "";
        this.currentGroup = null;
      }

      if (!this.withComment) {
        this.commitIssue();
      }
    }

    selectGroup(groupName: string) {
      if (this.isDisabled(groupName)) return;
      let popupIssueGroups = this.currentGroups.filter(x => x.groupName === groupName);
      if (popupIssueGroups.length) {
        if (popupIssueGroups[0].subGroup) {
          this.currentGroup = popupIssueGroups[0];
          this.currentIssuesGroup = this.currentGroup && this.currentGroup.subGroup ? this.currentGroup.subGroup[0] : null;
        } else {
          this.currentGroup = null;
          this.currentIssuesGroup = popupIssueGroups[0];
        }
      } else {
        this.currentGroup = null;
        this.currentIssuesGroup = null;
      }
    }

    selectSubGroup(groupName: string) {
      if (this.isDisabled(groupName)) return;
      let popupIssueGroups = this.currentGroups.filter(x => (x.subGroup ? x.subGroup : []).filter(k => k.groupName === groupName).length);
      const subGroup = popupIssueGroups.length ? popupIssueGroups[0].subGroup : null;
      this.currentIssuesGroup = subGroup ? subGroup.filter(k => k.groupName === groupName)[0] : null;
    }

    getGroup(issue: string): { group: PopupIssueGroup | null, subGroup: PopupIssueGroup | null } {
      let g: PopupIssueGroup | null = null;
      let s: PopupIssueGroup | null = null;
      this.currentGroups.forEach(x => {
        if (x.subGroup) {
          x.subGroup.forEach(l => {
            if (l.issues) {
              if (l.issues.filter(i => i.issue === issue).length > 0) {
                g = x;
                s = l;
              }
            }
          })
        } else if (x.issues) {
          if (x.issues.filter(i => i.issue === issue).length) {
            g = x;
          }
        }
      });
      return g ? {group: g, subGroup: s} : {group: null, subGroup: null};
    }

    commitIssue() {
      let args = {
        issue: this.selectedIssue,
        comment: this.issueComment,
        strength: this.selectedStrength
      } as PopupIssueDTO;
      this.$emit('commit', args);
    }

    close() {
      this.$emit('close');
    }

  }

</script>
<style lang="scss">

  #popupBase.issues-popup {
    line-height: initial;

    .issues-container {
      width: 100%;
      min-width: 100%;
      max-width: 100%;

      .typing {
        margin: 0;

        input {
          border: 0;
          background-color: #EEE;
          color: #0D252C;
          height: 40px !important;
          line-height: 40px;
          padding: 0;
          margin: 0;
          z-index: 999;

          &::placeholder {
            color: #666 !important;
          }
        }
      }
    }

    ul li.active {
      background-color: #D8D8D8;
    }

    ul li.disabled {
      opacity: .5;
      pointer-events: none;
    }

    .selected-pills {
      height: 40px;

      .pill-left:before {
        top: 8px;
      }

      .pill-right, .pill-left {
        line-height: 40px;
      }
    }

    .content {
      align-items: stretch;
      justify-content: flex-start;
      width: 750px;
      min-width: 750px;
      max-width: 750px;
      max-height: calc(570px + 1rem);

      input[type="text"] {
        width: 100%;
      }

      .body {
        padding: 0;
      }

      .comment-container {
        padding: 2rem 2rem 1rem 2rem;

        h4 {
          margin-top: 0;
        }

        .strength-selector {
          margin-bottom: .5rem;
        }
      }

    }
  }
</style>
<style scoped lang="scss">
  @import '~vue-wysiwyg-2/dist/vueWysiwyg.css';
  @import '../../../styles/grid/flex-grid';

  input {
    border-radius: 0;
  }

  h4 {
    margin-bottom: .3rem;
    font-size: 0.9rem;
    font-weight: 600;
  }

  #issuesPopup {

    text-align: left;

    input {
      height: 33px;
      font-size: .9rem;
      width: 100%;
      position: relative;
    }

    .left {
      background: linear-gradient(to right, #FFF 80%, #FDFDFD 100%);
      box-shadow: 0 0 2px rgba(0, 0, 0, .2);
      z-index: 2;
    }

    .left, .right, .middle {
      height: 493px;
      overflow: hidden;
    }

    .right {
      overflow-y: scroll;
    }

    .middle {
      overflow: hidden;
      background: #FAFAFA;
      position: relative;
      z-index: 1;
      box-shadow: 0 0 2px rgba(0, 0, 0, .2);
    }

    ul {
      font-size: .9rem;
      list-style: none;
      margin: 0 0 1rem;
      padding: 0;

      li {
        cursor: pointer;
        line-height: 35px;
        padding-left: 1rem;

        &:hover, &.active {
          background: #EEE;
        }
      }
    }

    .selected-pills {
      font-size: .9rem;

      .pill-left, .pill-right {
        line-height: 35px;
        padding: 0 0 0 1rem;
        background: #EEE;
      }

      .pill-right {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding: 0 1rem 0 .5rem;
      }

      .pill-left {
        position: relative;

        &:before {
          content: ' ';
          position: absolute;
          width: 23px;
          background: #EEE;
          height: 23px;
          top: 6px;
          right: 10px;
          transform: rotate(45deg);
          box-shadow: 0 0 2px rgba(0, 0, 0, .2);
        }

        &:after {
          content: ' ';
          position: absolute;
          width: 23px;
          background: #EEE;
          height: 35px;
          top: 0;
          right: 23px;
        }
      }
    }

    .comment-container {
      padding: 1rem;

      textarea {
        box-sizing: border-box;
        height: 100px;
      }

      h4 {
        margin-top: 0;
      }
    }

    .buttons {
      padding: 1rem;
    }

  }
</style>
