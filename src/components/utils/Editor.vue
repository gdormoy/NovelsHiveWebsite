<template>
  <div id="editor">
    <ckeditor :editor="editor"
              v-model="editorData"
              :config="editorConfig"
              @input="inputHandler" ></ckeditor>

    <div style="margin-left: 1%; margin-top: 1%; margin-bottom: 5%" v-if="showSaveStatus">
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

    <div style="position: absolute; right: 5%;">
      <v-btn
        @click="saveDraftHandler"
        color="blue-grey lighten-3"
      >
        Save as draft
      </v-btn>
      <v-btn
        @click="publishHandler"
        color="success"
      >
        Publish
      </v-btn>
    </div>
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
    showPreview: Boolean,
    dataChanged: Function,
    showSaveStatus: Boolean,
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
    publishHandler () {
      this.$emit('publish', this.editorData)
    },
    inputHandler () {
      this.$emit('updated', this.editorData)
      this.firstSave = true
    },
    saveDraftHandler () {
      this.$emit('save-as-draft', this.editorData)
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
