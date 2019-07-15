<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div id="myStories" data-app>
    <h1>My stories</h1>

    <h2>Drafts</h2>
    <chapter-icon-list :chapters="draftChapters"></chapter-icon-list>

    <h2>Beta</h2>
    <chapter-icon-list :chapters="betaChapters"></chapter-icon-list>

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
      betaChapters: [],
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

          story.panel = JSON.parse(story.panel)
          if (story.panel !== null && story.panel !== undefined) {
            let image = story.panel
            let mimeType = image.mimeType
            let base64Image = Buffer.from(image.content).toString('base64')
            story.panel = 'data:' + mimeType + ';base64,' + base64Image
          }

          story.storyChapters.forEach(function (chapter) {
            chapter.panel = story.panel

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

    this.$http.get(process.env.API_LOCATION + '/stories', {
      headers: {
        'Authorization': localStorage.accessToken
      },
      params: {
        'filter': {
          'include': [{
            'relation': 'betaReaders',
            'scope': {
              'where': {
                'userId': localStorage.userId
              }
            }
          },
          {
            'relation': 'storyChapters',
            'scope': {
              'where': {
                'online': false
              }
            }
          }
          ]
        }
      }
    })
      .then(res => {
        let stories = res.data
        let chapters = []
        stories.forEach(function (story) {
          if (story.betaReaders.length > 0) {
            story.storyChapters.forEach(function (chapter) {
              chapters.push(chapter)
            })
          }
        })
        this.betaChapters = chapters
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
