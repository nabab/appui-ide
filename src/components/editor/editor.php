<div class="bbn-overlay"
     v-if="typeOptions">
  <bbn-splitter orientation="vertical">
    <bbn-pane :size="43">
      <bbn-toolbar :button-space="true">
        <div class="bbn-left-spadding">
          <bbn-dropdown :source="source.project.path"
                        source-value="id"
                        v-model="currentPathId"
                        :storage="true"
                        :storage-full-name="'appui-newide-path-dd-' + source.project.id"
                        :disabled="isDropdownPathDisabled">
          </bbn-dropdown>
        </div>
        <div/>
        <bbn-button>
        </bbn-button>
        <div/>
        <div class="bbn-xspadding">
          <bbn-button>
          </bbn-button>
          <bbn-button>
          </bbn-button>
          <bbn-button>
          </bbn-button>
          <bbn-button>
          </bbn-button>
        </div>
        <div/>
      </bbn-toolbar>
    </bbn-pane>
    <bbn-pane title="Files">
      <bbn-splitter orientation="horizontal"
                    :resizable="true">
        <bbn-pane :resizable="true"
                  :size="220"
                  :min="40"
                  :collapsible="true">
          <bbn-input placeholder="Search Content"/>
          <bbn-dropdown v-if="currentPathType && currentPathType.types"
                        :source="currentPathType.types"
                        source-value="type"
                        source-url=""
                        source-text="type"
                        v-model="currentTypeCode"
                        :storage="true"
                        :storage-full-name="'appui-newide-type-dd-' + source.project.id + '-' + currentPathId"/>
          <bbn-tree :source="root + 'data/tree'"
                    :data="{
                           id_project: source.project.id,
                           type: currentTypeCode,
                           id_path: currentPathId
                           }"
                    ref="tree"
                    @nodeDblclick="treeNodeActivate"
                    :icon-color="iconColor"/>
        </bbn-pane>
        <bbn-pane :resizable="true">
					<bbn-router :autoload="true"
                      ref="router"
                      :nav="true"
                      :root="'newide/' + source.project.id + '/ide/'">
          </bbn-router>
        </bbn-pane>
        <bbn-pane :resizable="true"
                  :size="200"
                  :min="40"
                  :collapsed="true"
                  :collapsible="true">
          Structure
        </bbn-pane>
      </bbn-splitter>
    </bbn-pane>
  </bbn-splitter>
</div>