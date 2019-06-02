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
      rowsPerPageItems: [4],
      pagination: {
        rowsPerPage: 4
      }
    }
  },
  mounted () {
    this.$http.get(process.env.API_LOCATION + '/users/' + localStorage.userId + '/chapters', {
      headers: {
        'Authorization': localStorage.accessToken
      }
    })
      .then(response => {
        this.$data.stories = response.data.chapters.stories

        response.data.chapters.stories.forEach(function (story) {
          let storyName = story.title

          story.storyChapters.forEach(function (chapter) {
            let chapterToInsert = {'storyName': storyName, chapter: chapter}

            if (!chapter.online) {
              this.draftChapters.push(chapterToInsert)
            }
          }, this)
        }, this)
      })
  }
}
</script>

<style scoped>

</style>
