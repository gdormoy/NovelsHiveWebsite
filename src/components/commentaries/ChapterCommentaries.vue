<template>
  <div>
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
  data () {
    return {
      commentaries: []
    }
  },
  created () {
    console.log('Get commentaries')
    this.$http.get(process.env.API_LOCATION + '/chapters/' + this.$route.params.id + '/publishedCommentaries')
      .then(response => {
        console.log(response)
        let commentaries = response.data.commentaries

        for (let counter = 0; counter < commentaries.length; ++counter) {
          commentaries[counter].text = Buffer.from(commentaries[counter].text).toString('utf-8')
          commentaries[counter].publication_date = Moment(commentaries[counter].publication_date).format('lll')
        }

        this.commentaries = commentaries
      })
      .catch(error => console.log(error))
  }
}
</script>

<style scoped>

</style>
