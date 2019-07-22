<template>
  <div>
    <v-btn
      flat
      :disabled="previousChapterId === null"
      style="position: absolute; left: 20%;"
      @click="gotoChapter(previousChapterId)">
      <v-icon>$vuetify.icons.prev</v-icon>
      Previous
    </v-btn>
    <v-btn
      flat
      :disabled="nextChapterId === null"
      style="position: absolute; right: 20%;"
      @click="gotoChapter(nextChapterId)">
      Next <v-icon>$vuetify.icons.next</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'ChapterNavigation',
  props: ['previousChapterId', 'nextChapterId'],
  methods: {
    gotoChapter (chapterId) {
      this.$router.push('/read/' + chapterId.toString())
    }
  }
}
</script>

<style scoped>

</style>
