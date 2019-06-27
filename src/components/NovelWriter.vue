<template>
    <div id="novelWriter">
      <h1>Tell me a story</h1>

      <v-alert
        id="storyAlert"
        :value="storyError"
        :type="storyErrorType"
        dismissible
        style="width: 80%"
      >{{storyErrorMessage}}</v-alert>

      <v-select v-model="story" :items="userStories" label="Story" attach></v-select>

      <editor btn-text="Save" @btn-clicked="saveChapter" show-preview="true"/>
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
      serverDoesNotRespondErrorMessage: process.env.SERVER_DOES_NOT_RESPOND_ERROR_MESSAGE
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
      this.userStories = response.data.map(story => story.title)
    })
      .catch(err => {
        this.storyError = true
        this.storyErrorMessage = this.serverDoesNotRespondErrorMessage
        this.storyErrorType = 'error'
        console.log(err)
      })
      .finally(() => {
        this.$store.state.loader = false
      })
  },
  methods: {
    saveChapter (editorData) {
      console.log(editorData)
    }
  }
}
</script>

<style scoped>

</style>
