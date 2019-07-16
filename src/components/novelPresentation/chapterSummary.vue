<template>
  <div id="chapterSummary">
    <div id="chapters" v-for="chapter in chapters" :key="chapter.id" style="margin-bottom: 1%">
      <router-link :to="{ name: 'read', params: { id: chapter.id } }" v-if="chapter.online" tag="h3">
        {{chapter.number}}. {{chapter.title}}
      </router-link>
      <h3 v-else>{{chapter.title}}</h3>
    </div>
  </div>
</template>

<script>
export default {
  name: 'chapterSummary',
  props: {
    chapters: Array
  }
}
</script>

<style scoped>
  #chapters:hover {
    cursor: pointer;
    color: grey;
  }
</style>
