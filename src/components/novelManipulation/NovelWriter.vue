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
        menu-props="auto"
        attach></v-select>

      <v-text-field
        v-model="chapterTitle"
        label="Title"
        required></v-text-field>

      <editor
        btn-text="Save"
        @btn-clicked="publishHandler"
        @updated="dataUpdatedHandler"
        show-preview
        show-save
        :editor-data="editorText"
        :saving="saving" />
      <div>
      </div>
    </div>
</template>

<script>
import Editor from '../utils/Editor'
export default {
  name: 'NovelWriter',
  components: {Editor},
  data () {
    return {
      story: '',
      storyId: 0,
      userStories: [],
      storyError: false,
      storyErrorType: 'warning',
      storyErrorMessage: '',
      serverDoesNotRespondErrorMessage: process.env.SERVER_DOES_NOT_RESPOND_ERROR_MESSAGE,
      storyObjects: [],
      chapterTitle: '',
      chapterId: 0,
      lastUpdateDate: new Date(),
      minTimeBetweenUpdates: 3000,
      saving: false,
      updateStory: true,
      editorText: 'Write a wonderful story here'
    }
  },
  watch: {
    story: function () {
      this.createChapter()
    }
  },
  created () {
    this.$store.state.loader = true
    this.chapterId = this.$route.params.id

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
        this.storyObjects.push(story)
        this.userStories.push(story.title)
      }, this)

      if (this.chapterId !== undefined) {
        this.getChapter()
      } else {
        this.$store.state.loader = false
      }
    })
      .catch(err => {
        this.setError(this.serverDoesNotRespondErrorMessage)
        console.log(err)
        this.$store.state.loader = false
      })
  },
  methods: {
    getChapter () {
      if (this.chapterId !== undefined) {
        this.$http.get(process.env.API_LOCATION + '/chapters/' + this.chapterId)
          .then(response => {
            console.log(response)
            this.updateStory = false
            this.story = this.getStoryTitle(response.data.storyId)
            this.chapterTitle = response.data.title
            this.editorText = Buffer.from(response.data.text).toString('utf-8')
          })
          .catch(error => console.log(error))
          .finally(() => { this.$store.state.loader = false })
      }
    },
    saveChapter () {
      let now = new Date()
      if ((now - this.lastUpdateDate) < this.minTimeBetweenUpdates) return

      this.saving = true
      this.lastUpdateDate = now
      console.log('Patching chapterId : ' + this.chapterId)
      this.$http.patch(process.env.API_LOCATION + '/chapters/' + this.chapterId, {
        storyId: this.storyId,
        text: this.editorText,
        title: this.chapterTitle,
        update_date: new Date()
      }).then(response => console.log(response))
        .catch(error => console.log(error))
        .finally(() => {
          this.saving = false
        })
    },
    publishHandler () {
      console.log('publish button clicked')

      /*
      if (editorData === '') {
        return this.setError('You need to write something')
      }
      if (this.story === '') {
        return this.setError('You need to choose a story')
      }
      if (this.chapterTitle === '') {
        return this.setError('A chapter need a title')
      }

      console.log(this.getStoryId(this.story))

      this.$http.post(process.env.API_LOCATION + '/chapters', {
        text: editorData,
        update_date: new Date(),
        title: this.chapterTitle,
        storyId: this.getStoryId(this.story)
      }).then(response => this.saveSuccess(response))
        .catch(err => this.saveFailed(err))

       */
    },
    dataUpdatedHandler () {
      if (this.story === '') {
        console.log('ignore data changed')
      } else {
        console.log('save the data')
        this.saveChapter()
      }
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
    },
    getStoryTitle (id) {
      for (let counter = 0; counter < this.storyObjects.length; ++counter) {
        let el = this.storyObjects[counter]
        if (el.id === id) {
          return el.title
        }
      }
    },
    createChapter () {
      if (!this.updateStory) {
        this.updateStory = true
        return
      }

      this.storyId = this.getStoryId(this.story)
      console.log('Create a chapter for storyId : ' + this.storyId)

      if (this.chapterId !== undefined) {
        return
      }

      this.$http.post(process.env.API_LOCATION + '/chapters', {
        storyId: this.storyId
      }).then(response => {
        this.chapterId = response.data.id
      })
        .catch(error => console.log(error))
    }
  }
}
</script>

<style scoped>

</style>
