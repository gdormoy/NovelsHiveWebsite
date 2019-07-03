<template>
  <div id="story" style="margin-left: auto; margin-right: auto; width: 80%; text-justify: auto;">
    <h1 style="text-decoration: underline">{{story.title}}</h1>
    <p style="margin-bottom: 7%; margin-top: 3%;"><strong>Synopsis : </strong>{{story.synopsis}}</p>

    <div id="chapters" v-for="chapter in story.storyChapters" :key="chapter.id" style="margin-bottom: 1%">
      <router-link :to="{ name: 'read', params: { id: chapter.id } }" v-if="chapter.online" tag="h3">
        {{chapter.number}}. {{chapter.title}}
      </router-link>
      <h3 v-else><!--{{chapter.number}}/{{maxChapter}} : -->{{chapter.title}}</h3>
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
  #chapters:hover {
    cursor: pointer;
    color: grey;
  }
</style>
