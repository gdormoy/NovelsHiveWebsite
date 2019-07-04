<template>
  <div id="storySearcher">
    <h1>What do you want to read ?</h1>

    <v-text-field
      v-model="storyName"
      placeholder="Story name"
      prepend-inner-icon="search"
      clearable
      @input="searchParamsChanged"
    ></v-text-field>

    <v-select
      v-model="kind"
      :items="kinds"
      label="Kind"
      menu-props="auto"
      @change="searchParamsChanged"
      attach></v-select>

    <v-list three-line>
      <template v-for="story in stories">
        <v-list-tile
          :key="story.id"
          @click="gotoReading(story.id)">
          <v-list-tile-content>
            <v-list-tile-title>{{story.title}}</v-list-tile-title>
            <v-list-tile-sub-title>{{story.synopsis}}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
  </div>
</template>

<script>

export default {
  name: 'SearchStory',
  data () {
    return {
      storyName: '',
      stories: [],
      kind: '',
      kinds: [],
      kindsObject: [],
      kindId: 0
    }
  },
  created () {
    this.loadStories()

    this.$http.get(process.env.API_LOCATION + '/kinds')
      .then((response) => {
        this.kindsObject = response.data

        response.data.forEach((kind) => {
          this.kinds.push(kind.name)
        })
      })
      .catch((error) => console.log(error))
  },
  methods: {
    searchParamsChanged () {
      this.getKindIdByName()
      this.loadStories()
    },
    loadStories () {
      let titleFilter = {
        'title': {
          'like': this.getStoryNameForSearch()
        }
      }

      let whereArray = [titleFilter]

      let kindFilter = {
        'storyKindId': {
          'eq': this.kindId
        }
      }

      if (this.kindId !== 0) {
        whereArray.push(kindFilter)
      }

      let requestParam = {
        headers: {
          'Authorization': localStorage.accessToken
        }
      }

      let filterParam = {
        params: {
          'filter': {
            'where': {'and': whereArray},
            'limit': 20,
            'skip': 0
          }
        }
      }

      Object.assign(requestParam, filterParam)

      this.$http.get(process.env.API_LOCATION + '/stories', requestParam)
        .then(response => {
          this.stories = response.data

          this.stories.forEach((story) => {
            story.synopsis = Buffer.from(story.synopsis).toString('utf-8')
          })
        })
        .catch(error => console.log(error))
    },
    getStoryNameForSearch () {
      let result = '%'
      Array.from(this.storyName).forEach(char => {
        result += char + '%'
      })

      return result
    },
    gotoReading (storyId) {
      this.$router.push('/story/' + storyId)
    },
    getKindIdByName () {
      this.kindsObject.forEach((kind) => {
        if (kind.name === this.kind) {
          this.kindId = kind.id
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
