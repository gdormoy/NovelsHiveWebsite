<template>
  <div id="storySearcher">
    <h1>What do you want to read ?</h1>

    <div id="filter">
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

      <v-tabs
        v-model="favorite"
        @change="searchParamsChanged"
      >
        <v-tab
          v-for="(favLabel, index) in favorites"
          :key="index"
        >
          {{favLabel}}
        </v-tab>
      </v-tabs>
    </div>

    <tag-combobox @tags-changed="updateTags" :color="chipsColor"></tag-combobox>

    <div v-for="story in stories"
         :key="story.id"
         @click="gotoReading(story.id)"
         class="storyTile">
      <div class="title">
        {{ story.title }}
        <v-icon v-if="story.favorites[0] !== undefined" color="yellow darken-2" size="18">star</v-icon>
      </div>
      <div class="chips" v-for="tag in story.tags" :key="tag">
        <v-chip v-if="tags.includes(tag)" :color="chipsColor">{{ tag }}</v-chip>
        <v-chip v-else>{{ tag }}</v-chip>
      </div>
      <div class="synopsis">
        {{ story.synopsis }}
      </div>
    </div>
  </div>
</template>

<script>

import TagCombobox from '../utils/tagCombobox'
export default {
  name: 'SearchStory',
  components: {TagCombobox},
  data () {
    return {
      storyName: '',
      stories: [],
      kind: '',
      kinds: [],
      kindsObject: [{name: 'All kinds', id: 0}],
      kindId: 0,
      favorite: 0,
      favorites: ['All', 'Favorites', 'Non favorites'],
      tags: [],
      chipsColor: 'orange lighten-4'
    }
  },
  created () {
    this.loadStories()
    this.$http.get(process.env.API_LOCATION + '/kinds')
      .then((response) => {
        this.kinds.push(this.kindsObject[0].name)
        this.kind = this.kindsObject[0].name

        response.data.forEach((kind) => {
          this.kinds.push(kind.name)
          this.kindsObject.push(kind)
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
            'include': [
              {
                'relation': 'favorites',
                'scope': {
                  'where': {
                    'userId': localStorage.userId
                  }
                }
              },
              {
                'relation': 'storyHasStoryTags',
                'scope': {
                  'include': {
                    'relation': 'storyTag'
                  }
                }
              }
            ],
            'where': {'and': whereArray},
            'limit': 20,
            'skip': 0
          }
        }
      }

      Object.assign(requestParam, filterParam)

      this.$http.get(process.env.API_LOCATION + '/stories', requestParam)
        .then(response => {
          this.stories = []
          response.data.forEach((story) => {
            story.synopsis = Buffer.from(story.synopsis).toString('utf-8')

            // Favorite check
            if ((this.favorite === 1 && story.favorites[0] === undefined) ||
                (this.favorite === 2 && story.favorites[0] !== undefined)) {
              return
            }

            // Tag check
            let tags = story.storyHasStoryTags.map(tagLink => tagLink.storyTag.name)
            story.tags = tags
            delete story.storyHasStoryTags

            if (this.tags.length > 0) {
              let tagsIntersection = tags.filter(tag => this.tags.includes(tag))

              if (tagsIntersection.length !== this.tags.length) return
            }

            this.stories.push(story)
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
    },
    updateTags (tags) {
      this.tags = tags
      this.searchParamsChanged()
    }
  }
}
</script>

<style scoped>
  .storyTile {
    text-align: left;
    padding: 1%;
    border-radius: 5px;
  }

  .storyTile:hover {
    cursor: pointer;
    background-color: #EEEEEE;
  }

  .chips {
    display: inline-block;
  }
</style>
