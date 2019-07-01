<template>
  <div id="editor">
    <ckeditor :editor="editor"
              v-model="editorData"
              :config="editorConfig"
              @input="inputHandler" ></ckeditor>

    <div style="margin-left: 1%; margin-top: 1%; margin-bottom: 5%" v-if="showSave">
      <span v-if="saving">
        <v-progress-circular indeterminate></v-progress-circular>
        Saving...
      </span>
      <span v-else>
        <div v-if="firstSave">
          <v-icon color="green">save</v-icon>
          Saved !
        </div>
      </span>
    </div>

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
    dataChanged: Function,
    showSave: Boolean,
    saving: Boolean,
    initialText: String
  },
  data () {
    return {
      editor: ClassicEditor,
      editorData: '',
      editorConfig: {
        // The configuration of the editor.
      },
      doesShowPreview: false,
      firstSave: false
    }
  },
  mounted () {
    this.editorData = this.initialText
  },
  methods: {
    clickHandler () {
      this.$emit('btn-clicked', this.editorData)
    },
    inputHandler () {
      this.$emit('updated', this.editorData)
      this.firstSave = true
    }
  },
  watch: {
    initialText: function () {
      this.editorData = this.initialText
    }
  }
}
</script>

<style scoped>
  #editor {
    text-align: left;
  }
</style>
