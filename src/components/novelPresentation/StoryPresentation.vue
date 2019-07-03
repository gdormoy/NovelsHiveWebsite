<template>
  <div id="story" style="text-align: left; text-justify: auto;">
    <h1>{{story.title}}</h1>
    <p><strong>Synopsis : </strong>{{story.synopsis}}</p>

    <div v-for="chapter in story.storyChapters" :key="chapter.id">
      <router-link :to="{ name: 'read', params: { id: chapter.id } }" v-if="chapter.online">
        {{chapter.number}}/{{maxChapter}} : {{chapter.title}}
      </router-link>
      <p v-else>{{chapter.number}}/{{maxChapter}} : {{chapter.title}}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StoryPresentation',
  data () {
    return {
      story: {},
      maxChapter: 0
    }
  },
  created () {
    this.$store.state.loader = true

    let id = this.$route.params.id
    this.$http.get(process.env.API_LOCATION + '/stories/' + id + '/chapters')
      .then(response => {
        let story = response.data.story
        story.synopsis = Buffer.from(story.synopsis).toString('utf-8')
        this.story = story

        this.maxChapter = this.story.storyChapters.length
      })
      .catch(error => console.log(error))
      .finally(() => { this.$store.state.loader = false })
  }
}
</script>

<style scoped>

</style>
