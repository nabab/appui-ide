<!--ul class="bbn-ide-context"></ul-->
<bbn-splitter class="bbn-ide-container" orientation="vertical">
  <bbn-pane class="bbn-ide-toolbar-container"
            :size="40"
            :scrollable="false"
            overflow="visible">
    <bbn-toolbar class="bbn-ide">
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
                    icon="nf nf-oct-sync"
        ></bbn-button>
      </div>
      <div></div>
      <div>
        <bbn-button title="<?=_('Test code!')?>"
                    @click="test"
                    icon="nf nf-fa-magic"
        ></bbn-button>
      </div>
      <div>
        <bbn-button title="<?=_('Show History')?>"
                    @click="history"
                    icon="nf nf-fa-history"
        ></bbn-button>
      </div>
      <div>
        <bbn-button title="<?=_('Show strings and translations')?>"
                    @click="i18n"
                    icon="nf nf-fa-flag"
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
                  :collapsible="true"
                  orientation="horizontal"
    >
      <bbn-pane :size="200"
                :collapsible="true"
                :resizable="true"
      >
        <div class="bbn-flex-height">
          <div style="padding-top: 10px; padding-bottom: 10px; padding-left: 5px;">
            <bbn-input v-if="showSearchContent"
                       class="ide-tree-search"
                       v-model="search.searchInRepository"
                       @keydown.enter="searchingContent"
                       placeholder="<?=_('Search content')?>"
            ></bbn-input>
            <bbn-input  v-else
                        class="ide-tree-search"
                        placeholder="<?=_('Search file')?>"
                        v-model="searchFile"
            ></bbn-input>
            <bbn-checkbox name ="searchContent"
                          label="<?=_('Search content')?>"
                          v-model="showSearchContent"
                          :value="!showSearchContent"
                          style="padding-top: 6px;"
            ></bbn-checkbox>
            <bbn-checkbox v-if="showSearchContent"
                          label="<?=_('Match cases')?>"
                          v-model="search.caseSensitiveSearch"
                          :value="!search.caseSensitiveSearch"
                          style="padding-top: 6px;"
            ></bbn-checkbox>
          </div>
          <div class="bbn-w-100" v-if="isProject">
            <bbn-dropdown class="bbn-w-100"
                          :source="listRootProject"
                          v-model="typeProject"
            ></bbn-dropdown>
          </div>
          <div class="bbn-flex-fill" >
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
        <bbn-tabnav id="tabstrip_editor"
                    ref="tabstrip"
                    :autoload="true"
                    @close="ctrlCloseTab"
        >
          <bbns-container :static="true"
                          url="home"
                          :load="true"
                          :notext="true"
                          title="<?=_('Help')?>"
                          icon="nf nf-mdi-help_box"
          ></bbns-container>
        </bbn-tabnav>
      </bbn-pane>
      <bbn-pane :size="200"
                :collapsible="true"
                :resizable="true"
                :collapsed="true">
        <div class="bbn-overlay">
          <img :src="staticPath + 'img/winter_is_coming.png'">
        </div>
        <!--iframe class="bbn-100"
                src="#"
                 :bcolor="tab.bcolor"
        ></iframe-->
      </bbn-pane>
    </bbn-splitter>
  </bbn-pane>
</bbn-splitter>
