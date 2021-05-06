<template lang="html">
  <div id="issueSelectButton">
    <portal v-if="issuesPopup" to="issuesPopup" :disabled="!popupToNavbar" slim>
      <issues-popup :app-issues="appIssues"
                    :disabled-issues="disabledIssues"
                    :with-comment="withComment"
                    :start-issue="popupStartIssue"
                    :show-common-issues="showCommonIssues"
                    :title="issuesPopupTitle"
                    @commit="commitIssue"
                    @close="hideIssuesPopup()">
      </issues-popup>
    </portal>

    <div v-if="!inline" tabindex="-1">
      <button class="green fill"
              @click.prevent="showIssuesPopup()"
              tabindex="-1" accesskey="+" v-if="canEdit">
        Add issue to dashboard
        <font-awesome-icon :icon="['fas', 'plus']"></font-awesome-icon>
      </button>
    </div>

    <div v-else>
            <span class="issue-preview" v-if="issuePreview">
                <span v-if="issuePreviewTitle">{{issuePreviewTitle}}</span>
                {{issuePreview}}
            </span>
      <strength-selector @select="selectIssueStrength"
                         :selected="startIssueStrength"
                         v-if="hasIssue && issuePreview.indexOf('41') > -1"></strength-selector>
      <br v-if="hasIssue && !(issuePreview.indexOf('41') > -1) && !inlineButtons">
      <a href="#" @click.prevent.stop="showIssuesPopup()"
         v-if="canEdit"
         class="action-button"
         :class="{border: buttonsBorder}"
         :title="hasIssue ? 'Edit issue' : 'Select issue'" accesskey="r">
        {{hasIssue ? buttonLabelEdit : buttonLabelSelect}}
        <font-awesome-icon size="xs" :icon="['fas', hasIssue ? 'pencil' : 'plus']"></font-awesome-icon>
      </a>
      <a href="#" v-if="canEdit && hasIssue" @click.stop.prevent="remove()"
         :class="{border: buttonsBorder}"
         title="Remove issue" class="action-button remove-button">
        {{buttonLabelRemove}}
        <font-awesome-icon size="xs" :icon="['fas', 'trash']"></font-awesome-icon>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
  import {Portal} from 'portal-vue';
  import Vue from 'vue';
  import {Component, Prop} from 'vue-property-decorator';
  import {CommonUtils} from '../../src/utils/commonUtils';
  import IssuesPopup from './popup/issues-popup.vue';
  import {PopupIssueDTO, PopupIssueGroup} from "../../src/models/issues";
  import StrengthSelector from "../../src/components/strength-selector.vue";

  @Component({
    components: {
      IssuesPopup,
      Portal,
      StrengthSelector
    }
  })
  export default class IssueSelectButton extends Vue {

    issuesPopupTitle: string = '';
    private issuesPopup: boolean = false;

    @Prop() ipRightId!: string;
    @Prop({default: true}) showCommonIssues!: boolean;
    @Prop() startIssue!: string;
    @Prop() startIssueStrength!: string;
    @Prop({default: true}) issueNumberInPreview!: boolean;
    @Prop() appIssues!: string[];
    @Prop() disabledIssues!: string[] | null;
    @Prop({default: false}) inlineButtons!: boolean;
    @Prop({default: true}) buttonsBorder!: boolean;
    @Prop({default: ''}) issuePreviewTitle!: string;
    @Prop({default: false}) inline!: boolean;
    @Prop({default: true}) withComment!: boolean;
    @Prop({default: 'Select issue'}) buttonLabelSelect!: string;
    @Prop({default: 'Remove'}) buttonLabelRemove!: string;
    @Prop({default: 'Edit'}) buttonLabelEdit!: string;
    @Prop({default: () => ((window as any).ISSUES || [])}) allIssues!: PopupIssueGroup[];
    @Prop({default: true}) canEdit!: boolean;
    @Prop({default: false}) popupToNavbar!: boolean;
    @Prop({default: 'Raise new issue'}) title!: string;

    created() {
    }

    get issuePreview() {
      if (this.startIssue) {
        return CommonUtils.nestedIssueName(this.startIssue, this.allIssues, this.issueNumberInPreview);
      } else {
        return null;
      }
    }

    remove() {
      this.$emit('remove');
    }

    get hasIssue() {
      return this.startIssue || this.issuePreview;
    }

    get popupStartIssue() {
      return this.withComment && this.startIssue ? CommonUtils.findIssueById(this.startIssue, this.allIssues) : null;
    }

    commitIssue(i: PopupIssueDTO) {
      this.hideIssuesPopup();
      const issue = CommonUtils.nestedIssueName(i.issue, this.allIssues);
      if (issue && issue.indexOf('41') > -1) {
        i.strength = 's41(4)';
      } else {
        i.strength = null;
      }
      this.$emit('commit', i);
    }

    selectIssueStrength(x: string) {
      const k = CommonUtils.findIssueById(this.startIssue, this.allIssues);
      if (k) {
        k.strength = x;
        this.$emit('commit', k);
      }
    }

    showIssuesPopup(title?: string) {
      this.issuesPopup = true;
      this.issuesPopupTitle = title || this.title;
    }

    hideIssuesPopup() {
      this.issuesPopup = false;
    }
  }
</script>

<style scoped lang="scss">

  .issue-preview {
    font-size: .9rem;

    span {
      font-weight: bold;
    }
  }

  .action-button {
    display: inline-block;
    margin: 0.3rem 0.3rem 0.3rem 0;

    &.border {
      border: 1px solid $ipaLinkBlue;
      padding: 0.25rem .5rem;
      background-color: #FFFFFF;
      border-radius: 3px;
      line-height: 20px;
      transition: all 0.3s ease;

      &:hover {
        background-color: $ipaLinkBlue;
        color: #FFFFFF;
      }
    }

    &:not(.border) {
      border-bottom: 1px solid transparent;

      &:hover {
        border-bottom-color: $ipaLinkBlue;

        &.remove-button {
          border-bottom-color: $ipaRed;
        }
      }
    }

    &.remove-button {
      &.border {
        border: 1px solid $ipaRed;
      }

      color: $ipaRed;
    }
  }
</style>
