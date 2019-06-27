<template>
    <div id="novelWriter">
      <h1>Tell me a story</h1>
    <v-alert
      id="storyAlert"
      :value="storyError"
      :type="storyErrorType"
      dismissible
      style="width: 80%"
      @input="updateStoryErrorValue"
    >{{storyErrorMessage}}</v-alert>

    <v-select
        v-model="story"
        :items="userStories"
        label="Story"
        attach></v-select>

      <editor
        btn-text="Save"
        @btn-clicked="saveChapter"
        show-preview="true" />
    </div>
</template>

<script>
import Editor from './Editor'
export default {
  name: 'NovelWriter',
  components: {Editor},
  data () {
    return {
      story: '',
      userStories: [],
      storyError: false,
      storyErrorType: 'warning',
      storyErrorMessage: '',
      serverDoesNotRespondErrorMessage: process.env.SERVER_DOES_NOT_RESPOND_ERROR_MESSAGE,
      storyObjects: []
    }
  },
  mounted () {
    this.$store.state.loader = true
    this.$http.get(process.env.API_LOCATION + '/users/' + localStorage.userId + '/stories', {
      headers: {
        'Authorization': localStorage.accessToken
      },
      params: {
        'filter': {'order': 'update_date DESC'}
      }
    }).then(response => {
      let data = response.data

      if (data.length === 0) {
        this.storyError = true
        this.storyErrorMessage = 'You don\'t have any story yet. Try to create one :)'
        this.storyErrorType = 'warning'
      }

      data.forEach((story) => {
        console.log(story.id)
        this.storyObjects.push(story)
        this.userStories.push(story.title)
      }, this)
    })
      .catch(err => {
        this.setError(this.serverDoesNotRespondErrorMessage)
        console.log(err)
      })
      .finally(() => {
        this.$store.state.loader = false
      })
  },
  methods: {
    saveChapter (editorData) {
      if (editorData === '') {
        return this.setError('You need to write something')
      }
      if (this.story === '') {
        return this.setError('You need to choose a story')
      }

      console.log(this.getStoryId(this.story))

      this.$http.post(process.env.API_LOCATION + '/chapters', {
        text: editorData,
        update_date: new Date(),
        storyId: this.getStoryId(this.story)
      }).then(response => this.saveSuccess(response))
        .catch(err => this.saveFailed(err))
    },
    saveSuccess (response) {
      console.log(response)

      if (response.status !== 200) {
        return this.saveFailed(null)
      }

      this.$router.push('/my-stories')
    },
    saveFailed (error) {
      if (!error.response) {
        return this.setError(this.serverDoesNotRespondErrorMessage)
      }
      console.log(error)
    },
    setError (errorMessage) {
      this.storyError = true
      this.storyErrorMessage = errorMessage
      this.storyErrorType = 'error'
    },
    updateStoryErrorValue () {
      this.storyError = false
    },
    getStoryId (title) {
      for (let counter = 0; counter < this.storyObjects.length; ++counter) {
        let el = this.storyObjects[counter]
        if (el.title === title) {
          return el.id
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
