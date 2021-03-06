<template>
  <div>
    <div id="story" style="margin-left: auto; margin-right: auto; width: 80%; text-justify: auto;">
      <h1>
        <span style="text-decoration: underline">{{story.title}}</span>
        <favorite-handler style="float: right;" :favorite-id="favoriteId" :story-id="parseInt(this.$route.params.id)"></favorite-handler>
      </h1>
      <img :src="panel" alt="" id="panel">

      <v-icon>local_offer</v-icon>
      <div class="presentationElement" v-for="tag in story.tags" :key="tag" style="display: inline-block;">
        <v-chip>{{ tag }}</v-chip>
      </div>
      <p class="presentationElement"><strong>Author : </strong>{{authorUsername}}</p>
      <p class="presentationElement"><strong>Kind : </strong>{{storyKind}}</p>
      <p class="presentationElement"><strong>Publication date : </strong>{{publication_date}}</p>
      <p class="presentationElement"><strong>Last update date : </strong>{{update_date}}</p>
      <p class="presentationElement" style="margin-bottom: 7%;"><strong>Synopsis : </strong>{{story.synopsis}}</p>

      <chapter-summary :chapters="story.storyChapters"></chapter-summary>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import FavoriteHandler from '../novelManipulation/FavoriteHandler'
import ChapterSummary from './chapterSummary'

export default {
  name: 'StoryPresentation',
  components: {FavoriteHandler, ChapterSummary},
  data () {
    return {
      story: {},
      maxChapter: 0,
      storyKind: '',
      authorUsername: '',
      publication_date: '',
      update_date: '',
      panel: undefined,
      canAddBetaReaders: false,
      betaReadersTemplate: false
    }
  },
  created () {
    this.$store.state.loader = true

    let id = this.$route.params.id
    this.$http.get(process.env.API_LOCATION + '/stories/' + id + '/chapters', {
      params: {
        'userId': localStorage.userId,
        filter: {
          include: {
            'relation': 'storyHasStoryTags',
            'scope': {
              'include': {
                'relation': 'storyTag'
              }
            }
          }
        }
      }
    })
      .then(response => {
        let story = response.data.story
        story.synopsis = Buffer.from(story.synopsis).toString('utf-8')
        this.story = story
        if (story.userId === parseInt(localStorage.userId)) {
          this.canAddBetaReaders = true
        }
        this.authorUsername = story.user.username

        this.maxChapter = this.story.storyChapters.length
        this.storyKind = this.story.storyKind.name

        this.favoriteId = story.favorites[0] === undefined ? undefined : story.favorites[0].id

        moment.locale('fr')
        this.publication_date = moment(this.story.publication_date).format('lll')
        this.update_date = moment(this.story.update_date).format('lll')

        this.story.tags = this.story.storyHasStoryTags.map(tagLink => tagLink.storyTag.name)
        delete this.story.storyHasStoryTags

        if (story.panel !== null) {
          this.$http.get(process.env.API_LOCATION + '/containers/storyImage/files/' + story.panel + '/read')
            .then(response => {
              let mimeType = response.data.result.mimeType
              let base64Image = Buffer.from(response.data.result.content).toString('base64')
              let imageUrl = 'data:' + mimeType + ';base64,' + base64Image

              this.panel = imageUrl
            })
        }
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
      this.favoriteId = undefined
    }
  }
}
</script>

<style scoped>
  .presentationElement {
    margin-top: 3%;
  }

  #panel {
    max-width: 600px;
    max-height: 800px;
    display: block;
    margin: auto;
  }
</style>
