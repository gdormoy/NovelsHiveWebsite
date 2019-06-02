<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div id="myStories" data-app>
    <h1>My stories</h1>

    <h2>Drafts</h2>

    <v-container fluid grid-list-md>
      <v-data-iterator
        :items="draftChapters"
        :rows-per-page-items="rowsPerPageItems"
        :pagination.sync="pagination"
        content-tag="v-layout"
        no-results-text="You don't have any draft yet."
        row
        wrap
      >
        <template v-slot:item="props">
          <v-flex
            xs12
            sm6
            md4
            lg3
          >
            <chapter-icon :chapter="props.item.chapter"></chapter-icon>
          </v-flex>
        </template>
      </v-data-iterator>
    </v-container>

    <h2>Completed</h2>

  </div>
</template>

<script>
import ChapterIcon from './ChapterIcon'

export default {
  name: 'MyStories',
  components: {ChapterIcon},
  data () {
    return {
      stories: [],
      draftChapters: [],
      completedChapters: [],
      tempCompletedChapters: [],
      rowsPerPageItems: [4],
      pagination: {
        rowsPerPage: 4
      }
    }
  },
  mounted () {
    this.$store.state.loader = true
    this.$http.get(process.env.API_LOCATION + '/users/' + localStorage.userId + '/chapters', {
      headers: {
        'Authorization': localStorage.accessToken
      }
    })
      .then(response => {
        this.$data.stories = response.data.chapters.stories

        response.data.chapters.stories.forEach(function (story) {
          let storyName = story.title
          this.$data.tempCompletedChapters = {'storyName': storyName, chapters: []}

          story.storyChapters.forEach(function (chapter) {
            if (chapter.online) {
              this.tempCompletedChapters.chapters.push(chapter)
            } else {
              this.draftChapters.push({chapter})
            }
          }, this)

          if (this.$data.tempCompletedChapters.chapters.length > 0) {
            this.$data.completedChapters.push(this.$data.tempCompletedChapters)
          }
        }, this)
      })
      .finally(() => {
        this.$store.state.loader = false
        console.log(this.$data.completedChapters)
      })
  }
}
</script>

<style scoped>

</style>
