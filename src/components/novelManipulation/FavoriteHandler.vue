<template>
  <div id="favoriteHandler">
    <v-icon v-if="favoriteId !== undefined" large color="yellow darken-2" @click="deleteFavorite">star</v-icon>
    <v-icon v-else large color="darken-2" @click="addFavorite">star</v-icon>
  </div>
</template>

<script>
export default {
  name: 'FavoriteHandler',
  props: {
    favoriteId: Number,
    storyId: Number
  },
  methods: {
    addFavorite () {
      this.$http.post(process.env.API_LOCATION + '/stories/' + this.storyId + '/favorites', {
        headers: {
          'X-Access-Token': localStorage.accessToken
        },
        'userId': localStorage.userId,
        'storyId': this.storyId
      })
        .then(res => { this.favoriteId = res.data.id })
    },
    deleteFavorite () {
      this.$http.delete(process.env.API_LOCATION + '/favorites/' + this.favoriteId, {
        headers: {
          'X-Access-Token': localStorage.accessToken
        },
        'userId': localStorage.userId,
        'storyId': this.storyId
      })
        .then(res => (console.log(res)))
      this.favoriteId = undefined
    }
  }
}
</script>

<style scoped>

</style>
