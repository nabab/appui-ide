<!--ul class="bbn-ide-context"></ul-->
<bbn-splitter class="bbn-ide-container" orientation="vertical">
  <bbn-pane class="bbn-ide-toolbar-container"
            :size="40"
            :scrollable="false"
            overflow="visible">
    <bbn-toolbar class="bbn-ide">
      <div v-if="showSearchContent">
        <bbn-input class="ide-tree-search"
                   v-model="search.searchInRepository"
                   @keydown.enter="searchingContent"
                   placeholder="<?=_('Search content')?>"
        ></bbn-input>
      </div>
      <div v-else>
        <bbn-input class="ide-tree-search"
                   placeholder="<?=_('Search file')?>"
                   v-model="searchFile"
        ></bbn-input>
      </div>
      <div></div>
      <div>
        <bbn-dropdown class="ide-rep-select"
                      :source="ddRepData"
                      v-model="currentRep"
                      style="width: 250px"
        ></bbn-dropdown>
      </div>
      <div>
        <bbn-button title="<?=_('Refresh files list')?>"
                    @click="treeReload()"
                    icon="fa fa-refresh"
        ></bbn-button>
      </div>
      <div></div>
      <div>
        <bbn-button title="<?=_('Test code!')?>"
                    @click="test"
                    icon="fa fa-magic"
        ></bbn-button>
      </div>
      <div>
        <bbn-button title="<?=_('Show History')?>"
                    @click="history"
                    icon="fa fa-history"
        ></bbn-button>
      </div>
      <div></div>
      <div>
        <bbn-menu ref="mainMenu"
                  :source="menu"
        ></bbn-menu>
      </div>
    </bbn-toolbar>
  </bbn-pane>
  <bbn-pane>
    <bbn-splitter class="bbn-code-container"
                  :resizable="true"
                  orientation="horizontal">
      <bbn-pane :size="200"
                :collapsible="true"
                :resizable="true">
        <div class="bbn-flex-height">
          <div class="bbn-l" style="padding-top: 10px;padding-bottom: 10px;padding-left: 5px;">
            <bbn-checkbox name ="searchContent"
                          label="<?=_('Search content')?>"
                          v-model="showSearchContent"
                          :value="!showSearchContent"
            ></bbn-checkbox>
            <div v-if="showSearchContent">
              <bbn-checkbox label="<?=_('Match cases')?>"
                            v-model="search.caseSensitiveSearch"
                            :value="!search.caseSensitiveSearch"
              ></bbn-checkbox>
            </div>
          </div>
          <div class="bbn-flex-fill">
            <div class="bbn-full-screen">
              <bbn-tree class="tree"
                        :source="root + 'tree'"
                        @activate="treeNodeActivate"
                        :menu="treeContextMenu"
                        :data="treeInitialData"
                        ref="filesList"
                        :draggable="true"
                        @dragEnd="moveNode"
                        :map="treeMapper"
                        :icon-color="color"
                        :filter-string="searchFile"
                        :storage-full-name="'appui-ide-tree-' + currentRep"
              ></bbn-tree>
            </div>
          </div>
        </div>
      </bbn-pane>
      <bbn-pane :collapsible="true"
                :resizable="true"
                :scrollable="false">
        <div style="position: absolute; top: auto; left: auto; margin: 50%; text-align: center">
          <i class="fa fa-code"></i>
        </div>
        <bbn-tabnav id="tabstrip_editor"
                    ref="tabstrip"
                    :autoload="true"
                    @close="ctrlCloseTab">
          <bbn-tab :static="true"
                   url="home"
                   load="true"
                   :title="'<i class=\'bbn-xl zmdi zmdi-pin-help\'> </i>'">
          </bbn-tab>
        </bbn-tabnav>
      </bbn-pane>
      <bbn-pane :size="200"
                :collapsible="true"
                :resizable="true"
                :collapsed="true">
        <!--iframe class="bbn-100"
                src="#"
        ></iframe-->
      </bbn-pane>
    </bbn-splitter>
  </bbn-pane>
</bbn-splitter>