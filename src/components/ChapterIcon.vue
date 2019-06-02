<template>
    <div>
      <v-hover>
        <v-card
          slot-scope="{ hover }"
          max-width="150px"
        >
          <v-img
            src="../../static/book_img.jpg"
          >
            <v-expand-transition>
              <div
                v-if="hover"
                class="d-flex transition-fast-in-fast-out grey darken-2 v-card--reveal white--text pa-2"
                style="height: 100%;"
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
  name: 'ChapterIcon'
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
