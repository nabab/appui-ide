<div class="bbn-overlay"
     v-if="typeOptions && types">
  <bbn-splitter orientation="vertical">
    <bbn-pane :size="43">
      <bbn-toolbar :button-space="true">
        <div class="bbn-left-spadding">
          <bbn-dropdown :source="source.project.path"
                        source-value="id"
                        v-model="currentPathId"
                        :storage="true"
                        :storage-full-name="'appui-newide-path-dd-' + source.project.id"
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
                  :min="40">
          <bbn-input placeholder="Search Content"/>
          <bbn-dropdown v-if="currentPathType && currentPathType.types"
                        :source="currentPathType.types"
                        source-value="type"
                        source-url=""
                        source-text="url"
                        v-model="currentTypeCode"
                        :storage="true"
                        :storage-full-name="'appui-newide-type-dd-' + source.project.id + '-' + currentPathId"/>
          <bbn-tree :source="root + 'data/tree'"
                    :map="mapTree"
                    :data="{
                           id_project: source.project.id,
                           type: currentTypeCode,
                           id_path: currentPathId
                           }"
                    :storage="true"
                    :storage-full-name="'appui-newide-type-th-' + source.project.id + '-' + currentRoot"
                    ref="tree"
                    @nodeDblclick="treeNodeActivate"
                    :icon-color="iconColor"
                    :draggable="true"
                    @move="moveNode"
                    :menu="treeMenu"
                    class="bbn-bottom-smargin"/>
        </bbn-pane>
        <bbn-pane>
          <bbn-router :autoload="true"
                      ref="router"
                      :nav="true"
                      :root="'newide/' + source.project.id + '/ide/'"
                      :storage="true"
                      :storage-full-name="'appui-newide-editor-' + source.project.id">
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
  <bbn-popup ref="popup"></bbn-popup>
</div>
<bbn-loader v-else></bbn-loader>