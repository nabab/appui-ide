<div class="bbn-overlay bbn-flex-height">
  <bbn-toolbar class="bbn-hpadded">
    <div>
      <bbn-button :notext="true"
                  text="_('Select Class')"
                  icon="nf nf-fa-folder"/>
    </div>
    <div>
    </div>
    <div>
      <bbn-context :source="addActions">
        <bbn-button :notext="true"
                    text="_('Add ...')"
                    icon="nf nf-fa-plus">
        </bbn-button>
      </bbn-context>
    </div>
    <div>
    </div>
    <div>
      <bbn-dropdown :source="source.library"
                    :storage="true"
                    storage-full-name="appui-ide-class-editor-dropdown"
                    source-value="class"
                    v-model="currentClass"
                    source-text="class"/>
    </div>
  </bbn-toolbar>
  <div class="bbn-flex-fill">
    <bbn-loader v-if="isLoading"/>
    <appui-newide-cls v-else-if="currentClass && data"
                      :source="data"/>
    <div v-else
         class="bbn-overlay bbn-middle">
      <div>
        <h2>
          <?= _("Pick a class!") ?>
        </h2>
      </div>
    </div>
  </div>
</div>