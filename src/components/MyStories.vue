<template>
  <div id="myStories">
    <h1>My stories</h1>

    <h2>Drafts</h2>

    <ul>
      <li v-for="story in stories" :key="story.id">
        <ol>
          <li v-for="chapter in story.storyChapters" :key="chapter.id">
            {{chapter.title}}
          </li>
        </ol>
      </li>
    </ul>

    <h2>Completed</h2>

  </div>
</template>

<script>
export default {
  name: 'MyStories',
  data () {
    return {
      stories: []
    }
  },
  mounted () {
    this.$http.get(process.env.API_LOCATION + '/users/' + localStorage.userId + '/chapters', {
      headers: {
        'Authorization': localStorage.accessToken
      }
    })
      .then(response => {
        console.log(response)
        this.$data.stories = response.data.chapters.stories
      })
  }
}
</script>

<style scoped>

</style>
