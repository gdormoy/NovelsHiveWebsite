<template>
  <div>
    <v-hover class="ma-auto mt-3">
      <v-card
        slot-scope="{ hover }"
        max-width="150px"
      >
        <v-img
          src="../../static/book_img.png"
        >
          <v-expand-transition>
            <div
              v-if="hover"
              class="d-flex transition-fast-in-fast-out grey darken-2 v-card--reveal white--text pa-2"
              style="height: 100%; cursor: pointer;"
              @click="gotoReading(story.id)"
            >
              <p>{{story.synopsis}}</p>
            </div>
          </v-expand-transition>
        </v-img>
      </v-card>
    </v-hover>
  </div>
</template>

<script>
export default {
  props: ['story'],
  name: 'StoryIcon',
  data: () => (
    {
      chapters: []
    }
  ),
  methods: {
    gotoReading (storyId) {
      this.$http.get(process.env.API_LOCATION + '/stories/' + storyId + '/storyChapters', {
        headers: {
          'X-Access-Token': localStorage.accessToken
        }
      })
        .then(response => {
          this.chapters = response.data
          this.$router.push('/read/' + this.chapters[0].id)
        })
    }
  }
}
</script>

<style scoped>
  .v-card--reveal {
    align-items: center;
    bottom: 0;
    justify-content: center;
    opacity: .7;
    position: absolute;
    width: 100%;
  }
</style>
