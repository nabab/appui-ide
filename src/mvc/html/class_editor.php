<div class="bbn-overlay bbn-flex-height">
  <bbn-toolbar class="bbn-hpadding">
    <bbn-menu :source="menu"
              ref="menu"/>
    <!--div>
      <bbn-button :notext="true"
                  label="_('Select Class')"
                  icon="nf nf-fa-folder"/>
    </div>
    <div>
    </div>
    <div v-if="libInstalled">
      <bbn-context :source="addActions">
        <bbn-button :notext="true"
                    label="_('Add ...')"
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
      <bbn-dropdown :source="root + 'data/classes/' + libRoot + '/' + currentLibrary"
                    :storage="true"
                    ref="classesList"
                    storage-full-name="appui-ide-class-editor-dropdown-classe"
                    source-value="class"
                    v-model="currentClass"
                    v-if="!libraryChanging"
                    source-text="class"/>

    </div-->
  </bbn-toolbar>
  <div class="bbn-flex-fill">
    <bbn-loader v-if="isLoading"/>
    <appui-ide-cls v-else-if="currentClass && data"
                      :infos="tests_info"
                      :methinfos="methods_info"
                      :installed="libInstalled"
                      :libroot="libRoot"
                      :path="currentPath"
                      :mode="currentMode"
                      :source="data"/>
    <div v-else
         class="bbn-overlay bbn-middle">
      <div>
        <h2>
          <?= _("Pick a class!") ?>
        </h2>
        <h2>
          <?= _("or") ?>
        </h2>
        <h2>
          <?= _("Verify if test environment is installed!") ?>
        </h2>
      </div>
    </div>
  </div>
</div>
