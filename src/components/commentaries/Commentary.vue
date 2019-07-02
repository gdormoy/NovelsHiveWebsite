<template>
    <div style="text-align: left; margin-top: 3%;">
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title>
            <strong>{{commentary.username}}</strong>
            - {{commentary.publication_date}}
          </v-list-tile-title>
          <v-list-tile-sub-title>{{commentary.text}}</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </div>
</template>

<script>
export default {
  name: 'Commentary',
  props: {
    commentary: Object
  }
}
</script>

<style scoped>

</style>
