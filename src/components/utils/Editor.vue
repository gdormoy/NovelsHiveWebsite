<template>
  <div id="editor">
    <ckeditor :editor="editor" v-model="editorData" :config="editorConfig" @input="$emit('updated', editorData)"></ckeditor>
    <v-btn
      @click="clickHandler"
      color="success"
      style="position: absolute; right: 5%;"
    >
      {{btnText}}
    </v-btn>
    <v-checkbox v-if="showPreview" v-model="doesShowPreview" label="Show a preview"></v-checkbox>

    <div v-if="doesShowPreview">
      <h1>Live preview</h1>
      <div v-html="editorData"></div>
    </div>
  </div>
</template>

<script>
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

export default {
  name: 'Editor',
  props: {
    btnText: String,
    showPreview: Boolean,
    dataChanged: Function
  },
  data () {
    return {
      editor: ClassicEditor,
      editorData: '<p>Content of the editor.</p>',
      editorConfig: {
        // The configuration of the editor.
      },
      doesShowPreview: false
    }
  },
  methods: {
    clickHandler () {
      this.$emit('btn-clicked', this.editorData)
    }
  }
}
</script>

<style scoped>
  #editor {
    text-align: left;
  }
</style>
