<template>
  <div id="storySearcher">
    <h1>What do you want to read ?</h1>

    <v-text-field
      v-model="storyName"
      placeholder="Story name"
      prepend-inner-icon="search"
      clearable
      @input="storyNameChanged()"
    ></v-text-field>

    <v-list three-line>
      <template v-for="story in stories">
        <v-list-tile
          :key="story.id"
          @click="gotoReading(story.id, story.firstChapterId)">
          <v-list-tile-content>
            <v-list-tile-title>{{story.title}}</v-list-tile-title>
            <v-list-tile-sub-title>{{story.synopsis}}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
  </div>
</template>

<script>

export default {
  name: 'SearchStory',
  data () {
    return {
      storyName: '',
      stories: []
    }
  },
  created () {
    this.loadStories()
  },
  methods: {
    storyNameChanged () {
      this.loadStories()
    },
    loadStories () {
      this.$http.get(process.env.API_LOCATION + '/stories', {
        headers: {
          'Authorization': localStorage.accessToken
        },
        params: {
          'filter': {
            'include': {'relation': 'storyChapters', 'scope': {'where': {'number': 1}}},
            'where': {'title': {'like': this.getStoryNameForSearch()}},
            'limit': 20,
            'skip': 0
          }
        }
      }).then(response => {
        this.stories = response.data

        this.stories.forEach((story) => {
          story.synopsis = Buffer.from(story.synopsis).toString('utf-8')

          let chapter = story.storyChapters[0]
          story.firstChapterId = chapter === undefined ? 0 : chapter.id
        })
      })
        .catch(error => console.log(error))
    },
    getStoryNameForSearch () {
      let result = '%'
      Array.from(this.storyName).forEach(char => {
        result += char + '%'
      })

      return result
    },
    gotoReading (storyId, chapterId) {
      console.log('push storyid = ' + storyId + '; chapterId = ' + chapterId)

      this.$router.push('/read/' + chapterId)
    }
  }
}
</script>

<style scoped>

</style>
