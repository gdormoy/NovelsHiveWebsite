<template>
  <div class="hello">
    <h1>Stories</h1>
    <ul id="v-for-object" class="list">
      <li v-for="story in stories" v-bind:key="story.id" class="story">
        <div><h1>{{story.title}}</h1></div>
        <story-icon :story="story"></story-icon>
        <div>{{story.writer}}</div>
      </li>
    </ul>
  </div>
</template>

<script>
import StoryIcon from './novelPresentation/StoryIcon'

export default {
  name: 'Home',
  components: {StoryIcon},
  data: () => (
    {
      stories: []
    }
  ),
  created () {
    this.$http.get(process.env.API_LOCATION + '/stories/', {
      headers: {
        'X-Access-Token': localStorage.accessToken
      }
    }).then(response => {
      let data = response.data
      this.$data.stories = data
      this.$data.stories.forEach(function (story) {
        story.synopsis = Buffer.from(story.synopsis).toString('utf-8')
      })
      this.$data.stories.sort(function IHaveAName (a, b) {
        return b.title < a.title ? 1 : b.title > a.title ? -1 : 0
      })
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.list {
  text-align: left;
  margin-left: 10%;
  margin-right: 10%;
}

.story {
  text-align: center;
  margin-right: 5%;
  margin-left: 5%;
  width: 200px;
  height: 300px;
}

h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
