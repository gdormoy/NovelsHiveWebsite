<template>
  <div id="chapterReader">
    <h1>Read a chapter</h1>

    <div style="text-align: left;">
      <h2>{{chapter.title}}</h2>
      <div v-html="chapterData"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReadChapter',
  data () {
    return {
      chapter: {},
      chapterData: ''
    }
  },
  mounted () {
    console.log(this.$route.params.id)
    this.$store.state.loader = true

    this.$http.get(process.env.API_LOCATION + '/chapters/' + this.$route.params.id, {
      headers: {
        'Authorization': localStorage.accessToken
      }
    }).then(response => this.getChapterSuccessful(response))
      .catch(error => this.getChapterFailed(error))
      .finally(() => {
        this.$store.state.loader = false
      })
  },
  methods: {
    getChapterSuccessful (response) {
      if (!response.data) {
        return this.getChapterFailed(null)
      }

      this.chapter = response.data
      this.chapterData = Buffer.from(response.data.text.data).toString('utf-8')
    },
    getChapterFailed (error) {
      console.log(error)
    }
  }
}
</script>

<style scoped>

</style>
