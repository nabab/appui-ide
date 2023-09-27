<!-- HTML Document -->

<div class="appui-ide-cls-testor-codeditor bbn-w-100">
  <div class="bbn-grid">
    <bbn-toolbar class="bbn-radius"
                 :source="barButtons"></bbn-toolbar>
    <bbn-code v-model="code.current"
              :fill="false"
              :readonly="false"
              mode="purephp"/>
    <p v-if="code.current !== source.code" class="bbn-red">
      Press the Save button (changes not saved yet ......)
    </p>
    <br v-if="source.button">
    <div class="bbn-c" v-if="source.button">
      <bbn-button title="Modify"
                  text="Modify"
                  class="bbn-bg-green bbn-white"
                  :icon="'nf nf-fa-check_circle'"
                  @click.stop="confirm"></bbn-button>
    </div>
    <br v-if="source.button">
  </div>
</div>