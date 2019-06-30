<template>
  <v-dialog
    v-model="$store.state.loader"
    hide-overlay
    persistent
    width="300"
  >
    <v-card
      color="primary"
      dark
    >
      <v-card-text>
        Loading content<br><br>
        <v-progress-circular
          indeterminate
          color="blue"
          class="ma-auto"
        ></v-progress-circular>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'Loader'
}
</script>

<style scoped>

</style>
