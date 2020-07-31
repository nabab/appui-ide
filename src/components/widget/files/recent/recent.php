<div class="bbn-flex-width">
  <a :href="ideRoot + 'editor/' + source.url"
      v-text="source.filename"
      :title="source.file"
      class="bbn-flex-fill"
  ></a>
  <div v-text="fdatetime(source.moment)"></div>
</div>
