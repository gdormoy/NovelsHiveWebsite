<template>
  <div>
    <div id="favorite">
      <v-icon v-if="favorite" large color="yellow darken-2" @click="setFavorite">star outline</v-icon>
      <v-icon v-else large color="darken-2" @click="setFavorite">star outline</v-icon>
    </div>
    <div id="story" style="margin-left: auto; margin-right: auto; width: 80%; text-justify: auto;">
      <h1 style="text-decoration: underline">{{story.title}}</h1>
      <p style="margin-top: 3%;"><strong>Author : </strong>{{story.user.username}}</p>
      <p style="margin-top: 3%;"><strong>Kind : </strong>{{storyKind}}</p>
      <p style="margin-bottom: 7%; margin-top: 3%;"><strong>Synopsis : </strong>{{story.synopsis}}</p>

      <div id="chapters" v-for="chapter in story.storyChapters" :key="chapter.id" style="margin-bottom: 1%">
        <router-link :to="{ name: 'read', params: { id: chapter.id } }" v-if="chapter.online" tag="h3">
          {{chapter.number}}. {{chapter.title}}
        </router-link>
        <h3 v-else><!--{{chapter.number}}/{{maxChapter}} : -->{{chapter.title}}</h3>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StoryPresentation',
  data () {
    return {
      story: {},
      maxChapter: 0,
      storyKind: '',
      favorite: false,
      favoriteId: ''
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
        this.storyKind = this.story.storyKind.name
      })
      .catch(error => console.log(error))
      .finally(() => { this.$store.state.loader = false })

    this.$http.get(process.env.API_LOCATION + '/favorites/findOne', {
      headers: {
        'Authorization': localStorage.accessToken
      },
      params: {
        'filter': {
          'include': {'relation': 'user', 'scope': {'where': {'number': 1}}},
          'where': {'and': [{'storyId': {'like': id}}, {'userId': {'like': localStorage.userId}}]},
          'limit': 20,
          'skip': 0
        }
      }
    })
      .then(response => {
        this.favoriteId = response.data.id
        if (this.favoriteId !== '') {
          this.favorite = true
        }
      })
  },
  methods: {
    setFavorite () {
      let id = this.$route.params.id
      if (!this.favorite) {
        this.$http.post(process.env.API_LOCATION + '/stories/' + id + '/favorites', {
          headers: {
            'X-Access-Token': localStorage.accessToken
          },
          'userId': localStorage.userId,
          'storyId': id
        })
      } else {
        this.$http.delete(process.env.API_LOCATION + '/favorites/' + this.favoriteId, {
          headers: {
            'X-Access-Token': localStorage.accessToken
          },
          'userId': localStorage.userId,
          'storyId': id
        })
      }
      this.favorite = !this.favorite
    }
  }
}
</script>

<style scoped>
  #favorite{
    margin-right: -10%;
    float: right;
  }

  #chapters:hover {
    cursor: pointer;
    color: grey;
  }
</style>
