<template>
  <div>
    <v-textarea
      v-model="writedComment"
      label="Give a comment"
      auto-grow
      box
      clearable
      append-icon="send"
      @click:append="sendComment"
      :loading="sendingComment"
    ></v-textarea>

    <div :key="commentary.id" v-for="commentary in commentaries">
      <commentary :commentary="commentary"></commentary>
    </div>
  </div>
</template>

<script>
import Commentary from './Commentary'
import Moment from 'moment'

export default {
  name: 'ChapterCommentaries',
  components: {Commentary},
  props: {
    chapterId: String
  },
  data () {
    return {
      commentaries: [],
      writedComment: '',
      sendingComment: false
    }
  },
  created () {
    this.getComments()
  },
  methods: {
    getComments () {
      this.$http.get(process.env.API_LOCATION + '/chapters/' + this.$route.params.id + '/publishedCommentaries')
        .then(response => {
          let commentaries = response.data.commentaries

          for (let counter = 0; counter < commentaries.length; ++counter) {
            commentaries[counter].text = Buffer.from(commentaries[counter].text).toString('utf-8')
            commentaries[counter].publication_date = Moment(commentaries[counter].publication_date).format('lll')
          }

          this.commentaries = commentaries
        })
        .catch(error => console.log(error))
    },
    sendComment () {
      if (this.writedComment === '') return

      this.sendingComment = true
      this.$http.post(process.env.API_LOCATION + '/published_commentaries', {
        text: this.writedComment,
        publication_date: new Date(),
        userId: localStorage.userId,
        storyChapterId: this.chapterId
      })
        .then(() => this.getComments())
        .catch(error => console.log(error))
        .finally(() => { this.sendingComment = false })
    }
  }
}
</script>

<style scoped>

</style>
