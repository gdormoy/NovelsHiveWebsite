<template>
  <div id="chapterReader">
    <h1 style="margin-bottom: 5%">{{storyTitle}}</h1>

    <chapter-navigation
      :previous-chapter-id="previousChapterId"
      :next-chapter-id="nextChapterId"
      style="margin-bottom: 13%;"
    ></chapter-navigation>

    <div style="text-align: left;">
      <h2>{{chapterTitle}}</h2>
      <div v-html="chapterData"></div>
    </div>

    <chapter-navigation
      :previous-chapter-id="previousChapterId"
      :next-chapter-id="nextChapterId"
      style="margin-bottom: 7%;"
    ></chapter-navigation>
    <chapter-commentaries :chapter-id="$route.params.id"></chapter-commentaries>
  </div>
</template>

<script>
import ChapterNavigation from '../novelPresentation/ChapterNavigation'
import ChapterCommentaries from '../commentaries/ChapterCommentaries'

export default {
  name: 'ReadChapter',
  components: {ChapterNavigation, ChapterCommentaries},
  data () {
    return {
      storyTitle: '',
      chapterTitle: '',
      chapterData: '',
      previousChapterId: null,
      nextChapterId: null
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    loadData () {
      this.$store.state.loader = true

      this.$http.get(process.env.API_LOCATION + '/chapters/' + this.$route.params.id + '/read', {
        headers: {
          'Authorization': localStorage.accessToken
        }
      }).then(response => this.getChapterSuccessful(response))
        .catch(error => this.getChapterFailed(error))
        .finally(() => {
          this.$store.state.loader = false
        })
    },
    getChapterSuccessful (response) {
      if (!response.data) {
        return this.getChapterFailed(null)
      }

      this.storyTitle = response.data.chapter.storyTitle
      this.chapterTitle = response.data.chapter.title
      this.chapterData = Buffer.from(response.data.chapter.text.data).toString('utf-8')
      this.previousChapterId = response.data.chapter.previousChapter.id
      this.nextChapterId = response.data.chapter.nextChapter.id
    },
    getChapterFailed (error) {
      console.log(error)
    },
    gotoChapter (chapterId) {
      console.log('Entering gotoChapter(' + chapterId + ')')
      this.$router.push('/read/' + chapterId.toString())
    }
  }
}
</script>

<style scoped>

</style>
