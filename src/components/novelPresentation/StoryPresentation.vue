<template>
  <div>
    <div id="story" style="margin-left: auto; margin-right: auto; width: 80%; text-justify: auto;">
      <h1>
        <span style="text-decoration: underline">{{story.title}}</span>
        <div style="float: right;">
          <v-icon v-if="favoriteId !== undefined" large color="yellow darken-2" @click="deleteFavorite">star</v-icon>
          <v-icon v-else large color="darken-2" @click="addFavorite">star</v-icon>
        </div>
      </h1>
      <p class="presentationElement"><strong>Author : </strong>{{authorUsername}}</p>
      <p class="presentationElement"><strong>Kind : </strong>{{storyKind}}</p>
      <p class="presentationElement"><strong>Publication date : </strong>{{publication_date}}</p>
      <p class="presentationElement"><strong>Last update date : </strong>{{update_date}}</p>
      <p class="presentationElement" style="margin-bottom: 7%;"><strong>Synopsis : </strong>{{story.synopsis}}</p>

      <div id="chapters" v-for="chapter in story.storyChapters" :key="chapter.id" style="margin-bottom: 1%">
        <router-link :to="{ name: 'read', params: { id: chapter.id } }" v-if="chapter.online" tag="h3">
          {{chapter.number}}. {{chapter.title}}
        </router-link>
        <h3 v-else>{{chapter.title}}</h3>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'StoryPresentation',
  data () {
    return {
      story: {},
      maxChapter: 0,
      storyKind: '',
      favoriteId: '',
      authorUsername: '',
      publication_date: '',
      update_date: ''
    }
  },
  created () {
    this.$store.state.loader = true

    let id = this.$route.params.id
    this.$http.get(process.env.API_LOCATION + '/stories/' + id + '/chapters', {
      params: {
        'userId': localStorage.userId
      }
    })
      .then(response => {
        console.log(response)
        let story = response.data.story
        story.synopsis = Buffer.from(story.synopsis).toString('utf-8')
        this.story = story
        this.authorUsername = story.user.username

        this.maxChapter = this.story.storyChapters.length
        this.storyKind = this.story.storyKind.name

        this.favoriteId = story.favorites[0] === undefined ? undefined : story.favorites[0].id

        this.publication_date = moment(this.story.publication_date).format('lll')
        this.update_date = moment(this.story.update_date).format('lll')
      })
      .catch(error => console.log(error))
      .finally(() => { this.$store.state.loader = false })
  },
  methods: {
    addFavorite () {
      let id = this.$route.params.id
      this.$http.post(process.env.API_LOCATION + '/stories/' + id + '/favorites', {
        headers: {
          'X-Access-Token': localStorage.accessToken
        },
        'userId': localStorage.userId,
        'storyId': id
      })
        .then(res => { this.favoriteId = res.data.id })
    },
    deleteFavorite () {
      let id = this.$route.params.id
      this.$http.delete(process.env.API_LOCATION + '/favorites/' + this.favoriteId, {
        headers: {
          'X-Access-Token': localStorage.accessToken
        },
        'userId': localStorage.userId,
        'storyId': id
      })
        .then(res => (console.log(res)))
      this.favoriteId = undefined
    }
  }
}
</script>

<style scoped>
  #chapters:hover {
    cursor: pointer;
    color: grey;
  }

  .presentationElement {
    margin-top: 3%;
  }
</style>
