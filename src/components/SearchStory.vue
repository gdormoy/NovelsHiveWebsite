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
          @click="gotoReading">
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
  mounted () {
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
            'where': {'title': {'like': this.getStoryNameForSearch()}},
            'limit': 20,
            'skip': 0
          }
        }
      }).then(response => {
        console.log(response)
        this.stories = response.data

        this.stories.forEach((story) => {
          story.synopsis = Buffer.from(story.synopsis).toString('utf-8')
        })
        console.log(this.stories)
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
    gotoReading () {
      console.log('GotoReading()')
    }
  }
}
</script>

<style scoped>

</style>
