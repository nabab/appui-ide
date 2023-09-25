<!-- HTML Document -->

<div class="appui-ide-cls-testor-codeditor bbn-w-100">
  <div class="bbn-grid">
    <bbn-toolbar class="bbn-radius"
                 :source="barButtons"></bbn-toolbar>
    <bbn-code v-model="code.current"
              :fill="false"
              :readonly="false"
              mode="purephp"/>
    <p v-if="this.code.current !== this.source.code" class="bbn-red">
      Press the Save button (changes not saved yet ......)
    </p>
    <br>
    <div class="bbn-c">
      <bbn-button title="Modify"
                  text="Modify"
                  class="bbn-bg-green bbn-white"
                  :icon="'nf nf-fa-check_circle'"
                  @click.stop="confirm"></bbn-button>
    </div>
    <br>
  </div>
</div>