<template>
  <div id="myStories" data-app>
    <h1>My stories</h1>

    <h2>Drafts</h2>
    <chapter-icon-list :chapters="draftChapters"></chapter-icon-list>

    <h2>Completed</h2>
    <div v-for="story in completedChapters" :key="story.storyName">
      <chapter-icon-list :chapters="story.chapters" :story-name="story.storyName"></chapter-icon-list>
    </div>

  </div>
</template>

<script>
import ChapterIconList from './ChapterIconList'

export default {
  name: 'MyStories',
  components: {ChapterIconList},
  data () {
    return {
      stories: [],
      draftChapters: [],
      completedChapters: [],
      tempCompletedChapters: []
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
              this.draftChapters.push(chapter)
            }
          }, this)

          if (this.$data.tempCompletedChapters.chapters.length > 0) {
            this.$data.completedChapters.push(this.$data.tempCompletedChapters)
          }
        }, this)
      })
      .finally(() => {
        this.$store.state.loader = false
      })
  }
}
</script>

<style scoped>

</style>
