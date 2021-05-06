<template lang="html">
    <div>
        <navbar :hide-drop-down="true"
                :dashboard-breadcrumb="appTitle !== ''"
                :app-title="appTitle ? appTitle : 'Dashboard'"></navbar>

        <slot></slot>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {Component, Prop} from 'vue-property-decorator';

    import Navbar from "../../components/navbar.vue";

    @Component({
        components: {
            Navbar
        }
    })
    export default class BaseHelpPage extends Vue {
        @Prop({default: ''}) appTitle!: string;
    }
</script>

<style scoped lang="scss">
</style>
