<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container fluid grid-list-md>
    <v-data-iterator
      :items="chapters"
      :rows-per-page-items="rowsPerPageItems"
      :pagination.sync="pagination"
      content-tag="v-layout"
      no-results-text="You don't have any draft yet."
      row
      wrap
    >
      <template v-slot:header v-if="storyName">
        <h3>{{storyName}}</h3>
      </template>
      <template v-slot:item="props">
        <v-flex
          xs12
          sm6
          md4
          lg3
        >
          <chapter-icon :chapter="props.item"></chapter-icon>
        </v-flex>
      </template>
    </v-data-iterator>
  </v-container>
</template>

<script>
import ChapterIcon from './ChapterIcon'

export default {
  name: 'ChapterIconList',
  components: {ChapterIcon},
  data () {
    return {
      rowsPerPageItems: [4],
      pagination: {
        rowsPerPage: 4
      }
    }
  },
  props: {
    chapters: {
      type: Array,
      required: true
    },
    storyName: String
  }
}
</script>

<style scoped>

</style>
