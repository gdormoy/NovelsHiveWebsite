<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div id="myStories" data-app>
    <h1>My stories</h1>

    <h2>Drafts</h2>
    <chapter-icon-list :chapters="draftChapters"></chapter-icon-list>

    <h2>Completed</h2>
    <div v-for="story in completedChapters" :key="story.storyName">
      <chapter-icon-list :chapters="story.chapters" :story-name="story.storyName"></chapter-icon-list>
    </div>

    <v-speed-dial
      v-model="fab"
      fixed
      bottom
      right
      direction="top"
      open-on-hover
      transition="slide-y-reverse-transition"
    >
      <template v-slot:activator>
        <v-btn
          v-model="fab"
          color="blue darken-2"
          dark
          fab
        >
          <v-icon>add</v-icon>
          <v-icon>close</v-icon>
        </v-btn>
      </template>
      <v-btn
        fab
        dark
        small
        color="indigo"
        @click="gotoStoryCreation"
      >
        <v-icon>book</v-icon>
      </v-btn>
      <v-btn
        fab
        dark
        small
        color="indigo"
        @click="gotoChapterWriting"
      >
        <v-icon>description</v-icon>
      </v-btn>
    </v-speed-dial>

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
      tempCompletedChapters: [],
      fab: false
    }
  },
  created () {
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
  },
  methods: {
    gotoStoryCreation () {
      this.$router.push('/create-story')
    },
    gotoChapterWriting () {
      this.$router.push('/write')
    }
  }
}
</script>

<style scoped>

</style>
