<div class="bbn-overlay">
  <bbn-splitter v-if="ready"
                orientation="vertical">
    <bbn-pane :size="43">
      <bbn-toolbar :button-space="true">
        <div class="bbn-left-spadding">
          <bbn-dropdown :source="source.project.path"
                        source-value="id"
                        v-model="currentPathId"
                        :storage="true"
                        :storage-full-name="'appui-ide-path-dd-' + source.project.id"
                        :disabled="isDropdownPathDisabled"/>
        </div>
        <div/>
        <bbn-button title="<?=_('Refresh files list')?>"
                    @click="treeReload()"
                    icon="nf nf-oct-sync"
                    style="margin-left: 2px"
                    :notext="true"/>
        <div class="bbn-xspadding">
          <bbn-button title="<?=_('Testeeeee code!')?>"
                      @click="test"
                      icon="nf nf-fa-magic"
                      style="margin-left: 2px"
                      ref="btnTest"
                      :notext="true"/>
          <bbn-button title="<?=('Show history')?>"
                      @click="openHistory"
                      icon="nf nf-mdi-history"
                      style="margin-left: 2px"
                      :notext="true">
          </bbn-button>
        </div>
        <div/>
        <bbn-menu :source="toolbarMenu"
                  ref="mainMenu">
        </bbn-menu>
      </bbn-toolbar>
    </bbn-pane>
    <bbn-pane title="Files">
      <bbn-splitter orientation="horizontal"
                    :resizable="true"
                    :collapsible="true">
        <bbn-pane :size="220"
                  :min="40"
                  :scrollable="false">
          <div class="bbn-overlay bbn-flex-height">
            <div class="bbn-w-100">
              <bbn-input placeholder="Search Content"/><br>
              <bbn-dropdown v-if="currentPathType && currentPathType.types"
                            :source="currentPathType.types"
                            source-value="type"
                            source-url=""
                            source-text="url"
                            v-model="currentTypeCode"
                            :storage="true"
                            :storage-full-name="'appui-ide-type-dd-' + source.project.id + '-' + currentPathId"/>
            </div>
            <div class="bbn-flex-fill">
              <bbn-tree class="bbn-overlay"
                        :source="root + 'data/tree'"
                        :map="mapTree"
                        :data="{
                              id_project: source.project.id,
                              type: currentTypeCode,
                              id_path: currentPathId
                              }"
                        :storage="true"
                        :storage-full-name="'appui-ide-type-th-' + source.project.id + '-' + currentRoot"
                        ref="tree"
                        @nodedoubleclick="treeNodeActivate"
                        :icon-color="iconColor"
                        :draggable="true"
                        @move="moveNode"
                        :menu="treeMenu"/>
            </div>
          </div>
        </bbn-pane>
        <bbn-pane>
          <bbn-router :autoload="true"
                      ref="router"
                      :nav="true"
                      :root="'ide/' + source.project.id + '/ide/'"
                      :storage="true"
                      :storage-full-name="'appui-ide-editor-' + source.project.id">
          </bbn-router>
        </bbn-pane>
        <bbn-pane :size="200"
                  :min="40"
                  :collapsed="true">
          Structure
        </bbn-pane>
      </bbn-splitter>
    </bbn-pane>
  </bbn-splitter>
  <bbn-loader v-else></bbn-loader>
  <bbn-popup ref="popup"></bbn-popup>
</div>
