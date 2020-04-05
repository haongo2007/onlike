<style>
    @import 'assets/styles.css';
</style>
<template>
  <div id="app">
    <router-view/>
    <Chat v-if="this.$store.state.checkLogin"/>
  </div>
</template>

<script>

    import Chat from '@/components/Chat/Chat-View'
    export default {
        name: 'app',
        components: { Chat },
    }
</script>

<style>
    body {
        background-color: #f7f7f7;
        padding-top: 50px;
        padding-bottom: 50px;
    }
    .is-danger {
        color: #9f3a38;
    }
</style>
