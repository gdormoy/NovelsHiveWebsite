<template>
    <div>
      <v-hover class="ma-auto mt-3">
        <v-card
          slot-scope="{ hover }"
          max-width="150px"
        >
          <v-img :src="urlImage" alt="Chapter image">

            <v-expand-transition>
              <div
                v-if="hover"
                class="d-flex transition-fast-in-fast-out grey darken-2 v-card--reveal white--text pa-2"
                style="height: 100%; cursor: pointer;"
                @click="gotoReading(chapter.id)"
              >
                <p>{{chapter.title}}</p>
              </div>
            </v-expand-transition>
          </v-img>
        </v-card>
      </v-hover>
    </div>
</template>

<script>
export default {
  props: ['chapter'],
  name: 'ChapterIcon',
  data () {
    return {
      urlImage: ''
    }
  },
  methods: {
    gotoReading (chapterId) {
      this.$router.push('/read/' + chapterId)
    }
  },
  created () {
    if (this.chapter.panel === null || this.chapter.panel === undefined) {
      this.urlImage = '../../static/book_img.png'
    } else {
      this.urlImage = this.chapter.panel
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
