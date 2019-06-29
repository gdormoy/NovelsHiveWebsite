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
      <div
        v-for="story in stories"
        :key="story.id"
      >
        <h2>{{story.title}}</h2>
        <p>{{story.synopsis}}</p>
      </div>
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
    }
  }
}
</script>

<style scoped>

</style>
