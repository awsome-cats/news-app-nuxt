<template>
  <div>
    <h1>auth</h1>
    <pre>{{this.$route.params.id}}</pre>
    <!-- back -->
    <md-button 
    class="md-fab md-fab-bottom-right md-fixed md-primary"
    @click="$router.go(-1)"
    >
    <md-icon>arrow_back</md-icon>
    </md-button>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>