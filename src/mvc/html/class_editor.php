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
      <bbn-dropdown :source="source.libraries"
                    :storage="true"
                    storage-full-name="appui-ide-class-editor-dropdown-library"
                    v-model="currentLibrary" />
    </div>
    <div v-if="currentLibrary">
      <bbn-dropdown :source="root + 'data/classes/' + currentLibrary"
                    :storage="true"
                    storage-full-name="appui-ide-class-editor-dropdown-classe"
                    source-value="class"
                    v-model="currentClass"
                    source-text="class"/>

    </div>
    <div class="header">
      <bbn-button v-if="!libInstalled"
                  title="Install"
                  icon="nf nf-fa-edit"
                  class="primary bbn-padding"
                  @click.stop="makeEnv">Install Test environment</bbn-button>
      <bbn-button v-if="libInstalled"
                  title="Check"
                  :notext="true"
                  icon="nf nf-fa-check_square"
                  class="check bbn-padding"></bbn-button>
      <span v-if="libInstalled">(2days ago...)</span>
      <bbn-button v-if="libInstalled"
                  title="Delete"
                  icon="nf nf-md-alert_remove"
                  class="delete bbn-padding"
                  @click.stop="delEnv">Delete Test environment</bbn-button>
      <bbn-button v-if="libInstalled"
                  title="Update"
                  icon="nf nf-md-update"
                  class="update bbn-padding"
                  @click.stop="makeEnv">Update Test environment</bbn-button>
      <bbn-button v-if="modified.status"
                  title="Merge"
                  icon="nf nf-cod-repo_push"
                  class="push bbn-padding"
                  @click.stop="">Push Test environment</bbn-button>
    </div>
  </bbn-toolbar>
  <div class="bbn-flex-fill">
    <bbn-loader v-if="isLoading || !currentURL"/>
    <appui-newide-cls v-else-if="currentClass && data"
                      :infos="tests_info"
                      :installed="libInstalled"
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
