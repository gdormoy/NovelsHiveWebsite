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
import FavoriteHandler from '../novelManipulation/FavoriteHandler'

export default {
  name: 'StoryPresentation',
  components: {FavoriteHandler},
  data () {
    return {
      story: {},
      maxChapter: 0,
      storyKind: '',
      favoriteId: 0,
      authorUsername: '',
      publication_date: '',
      update_date: '',
      panel: undefined
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
        console.log(response)
        let story = response.data.story
        story.synopsis = Buffer.from(story.synopsis).toString('utf-8')
        this.story = story
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
          let url = process.env.API_LOCATION + 'storage/images/storyImage/' + story.panel
          console.log(url)

          this.$http.get(process.env.API_LOCATION + '/containers/storyImage/files/' + story.panel + '/read')
            .then(response => {
              console.log(response)
              let mimeType = response.data.result.mimeType
              let base64Image = Buffer.from(response.data.result.content).toString('base64')
              console.log(base64Image)
              let imageUrl = 'data:' + mimeType + ';base64,' + base64Image

              this.panel = imageUrl
            })
        }
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
