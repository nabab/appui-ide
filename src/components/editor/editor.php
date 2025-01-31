<div class="bbn-overlay">
  <bbn-splitter v-if="typeOptions && types"
                orientation="vertical">
    <bbn-pane :size="43">
      <bbn-toolbar :button-space="true">
        <div class="bbn-left-spadding">
          <bbn-dropdown :source="source.project.path"
                        source-value="id"
                        v-model="currentPathId"
                        :disabled="isDropdownPathDisabled"/>
        </div>
        <div/>
        <bbn-button title="<?= _('Refresh files list') ?>"
                    @click="treeReload()"
                    icon="nf nf-oct-sync"
                    style="margin-left: 2px"
                    :notext="true"/>
        <div class="bbn-xspadding">
          <bbn-button title="<?= _('Test code!') ?>"
                      @click="test"
                      icon="nf nf-fa-magic"
                      style="margin-left: 2px"
                      ref="btnTest"
                      :notext="true"/>
          <bbn-button title="<?= _('Show history') ?>"
                      @click="openHistory"
                      icon="nf nf-md-history"
                      style="margin-left: 2px"
                      :notext="true">
          </bbn-button>
        </div>
        <div/>
        <bbn-menu :source="toolbarMenu"
                  ref="mainMenu"/>
      </bbn-toolbar>
    </bbn-pane>
    <bbn-pane :scrollable="false">
      <div class="bbn-overlay">
        <bbn-splitter orientation="horizontal"
                      :resizable="true"
                      :collapsible="true">
          <bbn-pane :size="220"
                    :min="40"
                    :scrollable="false">
            <div class="bbn-flex-height">
              <div class="bbn-w-100 bbn-xspadding">
                <bbn-input placeholder="Search Content"/>
              </div>
              <div class="bbn-w-100 bbn-xspadding">
                <bbn-dropdown v-if="currentPathType?.types"
                              :source="currentPathType.types"
                              source-value="type"
                              source-url=""
                              source-text="url"
                              v-model="currentTypeCode"/>
              </div>
              <div class="bbn-flex-fill bbn-bottom-spadding">
                <bbn-tree :source="root + 'data/tree'"
                          bbn-if="treeData"
                          :map="mapTree"
                          :data="setNodeData"
                          uid="uid"
                          :storage="true"
                          :storage-full-name="'appui-ide-type-th-' + source.project.id + '-' + currentRoot"
                          ref="tree"
                          @nodedoubleclick="treeNodeActivate"
                          :icon-color="iconColor"
                          :drag="true"
                          @move="moveNode"
                          :menu="treeMenu"/>
              </div>
            </div>
          </bbn-pane>
          <bbn-pane>
            <bbn-router :autoload="true"
                        ref="router"
                        :nav="true"
                        :storage="true"
                        :storage-full-name="'appui-ide-editor-router-' + source.project.id"/>
          </bbn-pane>
          <!--bbn-pane :size="200"
                    :min="40"
                    :collapsed="true">
            Structure
          </bbn-pane-->
        </bbn-splitter>
      </div>
    </bbn-pane>
  </bbn-splitter>
  <bbn-loader v-else></bbn-loader>
  <bbn-popup ref="popup"></bbn-popup>
</div>

