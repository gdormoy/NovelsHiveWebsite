<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-combobox
    v-model="tags"
    :items="tagsProposal"
    :search-input.sync="tagValue"
    label="Tags"
    chips
    clearable
    multiple
  >
    <template v-slot:selection="data">
      <v-chip
        :selected="data.selected"
        close
        :color="color"
        @input="removeTag(data.item)"
      >
        {{ data.item }}
      </v-chip>
    </template>
  </v-combobox>
</template>

<script>
export default {
  name: 'tagCombobox',
  data () {
    return {
      tags: [],
      tagsProposal: [],
      tagValue: ''
    }
  },
  props: {
    color: String
  },
  methods: {
    removeTag (item) {
      this.tags.splice(this.tags.indexOf(item), 1)
      this.tags = [...this.tags]
    }
  },
  watch: {
    tagValue () {
      console.log(this.tagValue)
      let tag = this.tagValue

      if (tag === null || tag === undefined) return

      tag = tag.trim()

      if (tag.length < 3) {
        this.tagsProposal = []
        return
      }

      this.$http.get(process.env.API_LOCATION + '/tags', {
        params: {
          'filter': {
            'where': {
              'name': {
                'like': '%' + tag + '%'
              }
            }
          }
        }
      }).then(response => {
        let tags = response.data.map(object => object.name)

        this.tagsProposal = tags
      })
    },
    tags () {
      this.$emit('tags-changed', this.tags)
    }
  }
}
</script>

<style scoped>

</style>
