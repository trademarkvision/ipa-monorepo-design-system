<template lang="html">
  <div id="navbar" class="no-print"
       :class="[classList, {'nav-with-status': isTraining, 'with-navbar': isTraining, 'non-examination' : isTraining}]">
    <!-- breadcrumbs -->
    <div class="logo">
      <a href="#" @click.prevent="goHome"
         :title="dashboardBreadcrumb ? 'Back to dashboard' : 'Back to my dashboards'" accesskey="H">
        <img
          v-if="showRioLogo"
          src="data:image/png;base64,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"
          alt="">
        <span>
          <template v-if="dashboardBreadcrumb">Dashboard
            <font-awesome-icon :icon="['fas', 'chevron-right']"></font-awesome-icon>
          </template>
          {{appTitle}}
        </span>
      </a>
    </div>

    <!-- tabs -->
    <div class="navbar-content">
      <slot name="navbar-content"></slot>
    </div>

    <!-- dropdown menus -->
    <div class="menus">
      <!-- middle links -->
      <div class="dropdown-holder">
        <slot name="other-buttons"></slot>
      </div>

      <!-- mark dropdown -->
      <div v-if="hideMarkDropDown !== true && !dashboardGeneral && !dashboardNonExamination"
           class="dropdown-holder qa-account-dropdown"
           aria-expanded="false">
        <button aria-expanded="false" class="user-menu qa-space-button grey" accesskey="K"
                v-if="contextId !== 'General'"
                @click="openMarkWindow()">
          {{contextId}}
        </button>
        <button v-else style="cursor: initial;">{{contextId}}</button>
        <slot name="mark-dropdown"></slot>
      </div>
      <div v-else-if="hideMarkDropDown !== true && dashboardNonExamination && !dashboardGeneral"
           class="dropdown-holder qa-account-dropdown"
           aria-expanded="false">
        <button aria-expanded="false" class="user-menu qa-space-button grey" accesskey="K">
          {{contextId}}
        </button>
        <slot name="general-dropdown"></slot>
      </div>
      <div v-else-if="hideMarkDropDown !== true && dashboardGeneral"
           class="dropdown-holder qa-account-dropdown"
           aria-expanded="false">
        <button aria-expanded="false" class="user-menu qa-space-button grey" accesskey="K">
          {{generalDropdownTitle}}
        </button>
        <slot name="general-dropdown"></slot>
      </div>

      <!-- dropdown menu -->
      <div v-if="hideDropDown !== true"
           id="linksMenu"
           class="dropdown-holder qa-account-dropdown"
           aria-expanded="false">
        <button aria-label="Menu" aria-expanded="false"
                accesskey="_"
                id="linksMenuButton"
                @click="toggleLinksMenu()"
                class="user-menu main-menu qa-space-button grey"
                title="Links">
          <font-awesome-icon :icon="['fas', 'bars']"></font-awesome-icon>
        </button>

        <div class="dropdown-menu">
          <div class="content" @keydown.escape="closeDropdownMenu()">
            <a title="My dashboards" :href="dashboardUrl" accesskey="m">
              <font-awesome-icon :icon="['fas', 'home']"></font-awesome-icon>
              <span><i class="u">M</i>y dashboards</span>
            </a>
            <a title="General dashboard" :href="dashboardUrl + '/general'"
               class="qa-general-dashboard" target="_blank" accesskey="0">
              <font-awesome-icon :icon="['fas', 'table']"></font-awesome-icon>
              <span>General dashboard</span>
            </a>

            <a title="General search" :href="dashboardUrl + '/general-search'"
            class="qa-general-search" target="_blank">
            <font-awesome-icon :icon="['fas', 'search']"></font-awesome-icon>
            <span>General search</span>
            </a>

            <slot name="dropdown-content"></slot>
          </div>
        </div>
      </div>
    </div>

    <!-- status bar -->
    <div v-html="statusBarContent" class="status-bar"></div>

    <!-- popups -->
    <portal-target name="issuesPopup" slim></portal-target>
    <timeout-popup></timeout-popup>
    <toast></toast>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {PortalTarget} from 'portal-vue';
  import {Component, Prop, Watch} from 'vue-property-decorator';
  import TimeoutPopup from './popup/timeout-popup.vue';
  import Toast from './toast.vue';

  @Component({
    components: {
      PortalTarget,
      TimeoutPopup,
      Toast
    }
  })
  export default class Navbar extends Vue {

    @Prop() dashboardHost!: string;
    @Prop() statusBarMessage!: string;
    @Prop() classList!: string;
    @Prop() markViewUrl!: string;
    @Prop() goHome!: () => void;
    @Prop() hideDropDown!: boolean;
    @Prop() hideMarkDropDown!: boolean;
    @Prop() dashboardGeneral!: boolean;
    @Prop() dashboardNonExamination!: boolean;
    @Prop() generalDropdownTitle!: string;
    @Prop() dashboardBreadcrumb!: boolean;
    @Prop() appTitle!: string;
    @Prop() contextId!: string;
    @Prop({default: true}) showRioLogo!: boolean;

    created() {
      if (!document.body.classList.contains('with-navbar')) {
        document.body.classList.add('with-navbar');
      }
    }

    @Watch('hasStatusBar', {immediate: true})
    statusBarToggled(hasStatusBar: boolean) {
      if (this.isTraining || hasStatusBar) {
        document.body.classList.add('with-navbar-status');
      } else {
        document.body.classList.remove('with-navbar-status');
      }
    }

    get hasStatusBar(): boolean {
      return !!(this.classList && this.classList.split(' ').indexOf('nav-with-status') !== -1);
    }

    get isTraining() {
      return ((window as any).IS_TRAINING_MODE as boolean) || false;
    }

    get statusBarContent() {
      const trainingMessage = this.isTraining ? "RIO Dashboard for Academy use. Trade mark details are not up to date. " : "";
      if (this.statusBarMessage && this.statusBarMessage.length) {
        return `${trainingMessage}${this.statusBarMessage}`;
      }

      if (this.classList) {
        const k = this.classList.split(' ');
        if (k.indexOf('general') > -1) {
          return `${trainingMessage}General dashboard`;
        }

        if (k.indexOf('non-examination') > -1) {
          return `${trainingMessage}Non-examination dashboard`;
        }
      }

      return trainingMessage;
    }

    get dashboardUrl() {
      return (this.dashboardHost || '');
    }

    openMarkWindow() {
      window.open(this.markViewUrl);
    }

    toggleLinksMenu() {
      if ((<HTMLDivElement>document.querySelector('#linksMenu')).classList.contains('expanded')) {
        (<HTMLDivElement>document.querySelector('#linksMenu')).classList.remove('expanded');
        (<HTMLElement>document.querySelector('body')).focus();
      } else {
        (<HTMLDivElement>document.querySelector('#linksMenu')).classList.add('expanded');
        (<HTMLLinkElement>document.querySelector('#linksMenuButton + .dropdown-menu a')).focus();
      }
    }
  }
</script>

<style lang="scss">

  body {
    &.with-navbar {
      padding-top: $headerHeight;
      min-width: 1024px;
    }

    &.with-navbar-status {
      padding-top: calc(#{$headerHeight} + #{$headerStatusHeight});
    }
  }
</style>

<style scoped lang="scss">

  #navbar {
    display: flex;
    flex-direction: row;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: $headerHeight;
    background: $ipaCharcoal;
    z-index: 10;

    a:not(.button) {
      color: $white;

      &.inline-with-i {
        position: relative;
        display: inline-block;

        i {
          position: absolute;
          font-size: 1.1rem;
          top: 2px;
          right: 0;
        }

        span {
          line-height: 1.4rem;
          display: inline-block;
          margin-right: 9px;
        }

        &.left {
          i {
            left: 0;
          }

          span {
            padding-right: 0;
            margin-left: 9px;
          }
        }
      }

      i {
        font-size: 1.4rem;
      }
    }

    & > div {
      width: 50%;
    }

    .logo {
      padding-left: 1rem;
      width: 25%;

      a {
        display: flex;
        width: auto;

        img {
          max-height: $headerHeight;
        }

        span {
          padding-left: 10px;
          font-size: .9rem;
          display: flex;
          line-height: 60px;
          align-items: center;
          white-space: nowrap;

          svg {
            margin: 2px 4px 0 5px;
          }
        }
      }
    }

    .navbar-content {
      display: flex;
      align-items: center;
      justify-content: center;
      align-content: center;
      width: 50%;
      height: 100%;
      color: white;

      .steps-display {
        align-items: center;
        color: #FFFFFF;
        display: flex;
        flex-direction: row;
        font-size: 1rem;
        justify-content: space-between;
        margin: 0.5rem auto 0;
        max-width: 480px;
        width: 100%;
        left: calc(50% - 240px);

        &.additionalStep {
          max-width: 560px;
        }

        h5 {
          font-size: 14.4px;
          margin: 0;
          z-index: 999;
        }
      }

      .step {
        text-transform: uppercase;
        transition: all 0.3s ease;
        line-height: 40px;
        border-bottom: 3px solid transparent;
        margin: 0 0.50rem;
        height: 100%;
        display: flex;
        position: relative;

        &:after {
          content: ' ';
          position: absolute;
          width: 100%;
          height: 3px;
          background: transparent;
          bottom: 0.5rem;
        }

        a {
          display: flex;
          align-items: center;
          font-size: 1rem;
          white-space: nowrap;
        }

        &:hover {
          cursor: pointer;

          &:after {
            background: white;
          }
        }

        &.activeStep {
          &:after {
            background: white;
          }
        }
      }

      .step-btn {
        background-color: #4D4D4D;
        border: none;
        border-radius: 1.25rem;
        padding: 0.4rem;
        position: relative;
        width: 70px;
        color: white;

        &:focus {
          border: 1px solid #5AB6FD;
          box-shadow: 0 0 5px #5AB6FD;
        }
      }
    }

    .menus {
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      width: 25%;
    }

    img.claims-icon {
      height: 40px !important;
      margin-top: 10px;

    }

    // Basic buttons
    button, a.button, a.dropdown-button {
      padding: 0 1rem;
      border: none;
      font-size: 1rem;
      color: $white;
      border-radius: 0;
      min-width: 2rem;
      text-align: center;

      i {
        font-size: 1rem;
      }

      span {
        white-space: nowrap;
        overflow: hidden;
      }

      &.active, &:hover, &:focus {
        background: nth($ipaCharcoalPalette, 1);
        color: $ipaCharcoal;
      }
    }

    .status-bar {
      display: none;
    }

    &.nav-with-status {
      .status-bar {
        font-weight: 600;
        position: absolute;
        text-align: center;
        top: 60px;
        visibility: visible;
        font-size: .8rem;
        line-height: 1rem;
        padding: 5px;
        flex-direction: column;
        flex-grow: 1;
        width: calc(100% - 10px);
        display: none;
      }

      &.general {
        .status-bar {
          color: #8B0000;
          background: rgb(252, 198, 114);
          border-bottom: 2px solid orange;
          display: flex;
        }
      }

      &.non-examination {
        .status-bar {
          color: #40072A;
          background: #EFC0DD;
          border-bottom: 2px solid #AB568A;
          display: flex;
        }
      }

      &.reported {
        .status-bar {
          color: #12502D;
          background: rgb(197, 223, 210);
          border-bottom: 2px solid #089677;
          display: flex;
        }
      }

      &.failed-report {
        .status-bar {
          color: #500303;
          background: #F7ABAB;
          border-bottom: 2px solid #FF2A00;
          display: flex;
        }
      }

      &.processing-report {
        .status-bar {
          color: #004252;
          background: rgba(80, 177, 206, 0.35);
          border-bottom: 2px solid #6195D2;
          display: flex;
        }
      }
    }

    .dropdown-menu {
      .content {
        background-color: $white;
        color: $ipaCharcoal;
        width: 250px;
        position: absolute;
        right: 0;
        top: $headerHeight;
        text-transform: none;
        display: flex;
        flex-direction: column;

        & ::v-deep a {
          &:not(.button) {
            font-size: .9rem;
            display: flex;
            align-items: center;
            text-align: left;
            line-height: 50px;
            color: $ipaCharcoal;
            border-bottom: 1px solid rgba(58, 58, 58, 0.1);
            width: 100%;
            text-transform: none;

            &:hover {
              background: $ipaCharcoal;
              color: $white;
            }

            i,
            svg {
              display: inline-block;
              width: 40px;
              text-align: center;
            }

            &.red {
              color: $ipaRed;

              &:hover {
                background: $ipaRed;
                color: $white;
              }
            }
          }

          &.add-classes {
            font-size: .8rem;
            display: inline-block;
            border: none;
            background: none;
            line-height: initial;
            width: auto;
            padding: 0;
            color: #3264B7;
            border-bottom: 0;

            i,
            svg {
              width: 1rem;
            }

            &:hover {
              background: none;
              color: darken(#3264B7, 5);
            }
          }
        }
      }
    }
  }
</style>
