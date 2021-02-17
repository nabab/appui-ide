<!--ul class="bbn-ide-context"></ul-->
<bbn-splitter class="bbn-overlay bbn-ide-container" orientation="vertical">
  <bbn-pane class="bbn-ide-toolbar-container"
            :size="40"
            :scrollable="false"
            overflow="visible">
    <bbn-toolbar class="bbn-ide bbn-overlay"
                 ref="toolbar">
      <div>
        <bbn-dropdown class="ide-rep-select"
                      :storage="true"
                      ref="ddRep"
                      :storage-full-name="'appui-ide-rep-select-' + project"
                      :source="ddRepData"
                      v-model="currentRep"
                      style="width: 250px"
        ></bbn-dropdown>
      </div>
      <div></div>
      <div>
        <bbn-button title="<?=_('Refresh files list')?>"
                    @click="treeReload()"
                    icon="nf nf-oct-sync"
                    style="margin-left: 2px"
                    :notext="true"
        ></bbn-button>
      </div>
      <div></div>
      <div>
        <bbn-button title="<?=_('Test code!')?>"
                    @click="test"
                    icon="nf nf-fa-magic"
                    style="margin-left: 2px"
                    ref="btnTest"
                    :disabled="disabledWork"
                    :notext="true"
        ></bbn-button>
      </div>
      <div>
        <bbn-button title="<?=_('Show History')?>"
                    @click="history"
                    icon="nf nf-fa-history"
                    style="margin-left: 2px"
                    :disabled="disabledWork"
                    :notext="true"
        ></bbn-button>
      </div>
      <div>
        <bbn-button title="<?=_('Show strings and translations')?>"
                    @click="i18n"
                    icon="nf nf-fa-flag"
                    style="margin-left: 2px"
                    :notext="true"
        ></bbn-button>
      </div>
      <div></div>
      <div>
        <bbn-menu ref="mainMenu"
                  :source="menu"
                  @ready="setReadyMenu"
                  style="margin-left: 2px"
        ></bbn-menu>
      </div>
      <div></div>
      <div class="bbn-flex-width bbn-middle">
        <span class="bbn-flex-fill bbn-r bbn-padded" v-if="showGoTOLine"><?=_('Go to Line:')?></span>
        <bbn-numeric v-model="currentLine"
                   type="number"
                   :min="1"
                   @input="goToLine"
                   @submit="goToLine"
                   v-if="showGoTOLine"
        ></bbn-numeric>
      </div>
      <div></div>
      <div>
        <bbn-button :icon = "showGoTOLine ? 'nf nf-fa-eye_slash' : 'nf nf-fa-eye'"
                    @click="()=>{
                      showGoTOLine = !showGoTOLine
                    }"
                    title="<?=_('Click for go to line')?>"
                    :notext="true"
        ></bbn-button>
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
        <bbn-splitter orientation="vertical"
                      ref="treeSplitter"
                      :collapsible="true"
                      :resizable="true">
          <bbn-pane :title="_('Files')">
            <div class="bbn-flex-height">
              <div class="bbn-spadded">
                <bbn-input v-if="showSearchContent"
                           class="ide-tree-search bbn-w-100"
                           v-model="search.searchElement"
                           @keydown.enter="searchingContent"
                           placeholder="<?=_('Search content')?>"
                ></bbn-input>
                <bbn-input  v-else
                            class="ide-tree-search bbn-w-100"
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
                              label="<?=_('All Repositories')?>"
                              v-model="search.all"
                              :value="!search.all"
                              style="padding-top: 6px;"
                ></bbn-checkbox>
                <bbn-checkbox v-if="showSearchContent"
                              label="<?=_('Match cases')?>"
                              v-model="search.caseSensitiveSearch"
                              :value="!search.caseSensitiveSearch"
                              style="padding-top: 6px;"
                ></bbn-checkbox>
              </div>
              <div class="bbn-spadded" v-if="isProject">
                <bbn-dropdown class="bbn-w-100"
                              v-if="listRootProject.length"
                              :storage="true"
                              :storage-full-name="'appui-ide-root-project-' + project"
                              :source="listRootProject"
                              default="mvc"
                              v-model="typeProject"
                              ref="ddRoot"
                              @hook:mounted="typeProjectReady = true"
                ></bbn-dropdown>
              </div>
              <div class="bbn-flex-fill">
                <div class="bbn-overlay" v-if="!isProject || typeProject">
                  <bbn-tree class="tree"
                            v-if="typeProjectReady"
                            :source="source.root + 'tree'"
                            @nodeDblclick="treeNodeActivate"
                            :menu="treeContextMenu"
                            ref="filesList"
                            :draggable="true"
                            :data="treeInitialData"
                            @move="moveNode"
                            uid="uid"
                            :map="treeMapper"
                            :icon-color="color"
                            :quick-filter="searchFile"
                            :storage="true"
                            :storage-full-name="'appui-ide-tree/' + source.project + '/' + currentRep + (typeProject ? '/' + typeProject : '')"
                  ></bbn-tree>
                </div>
              </div>
            </div>
          </bbn-pane>
          <bbn-pane :collapsed="true" :title="_('Detail')">
          	<h1>
              Detail
            </h1>
          </bbn-pane>
          <bbn-pane :collapsed="true" :title="_('Version control')">
          	<h1>
              Version control
            </h1>
          </bbn-pane>
          <bbn-pane :collapsed="true" :title="_('Other servers')">
          	<h1>
              Other servers
            </h1>
          </bbn-pane>
        </bbn-splitter>
      </bbn-pane>
      <bbn-pane :collapsible="true"
                :resizable="true"
                :scrollable="false"
      >
        <bbn-router id="tabstrip_editor"
                    :nav="true"
                    :master="true"
                    ref="tabstrip"
                    @beforeClose="ctrlCloseTab"
                    @ready="createTabstrip"
        >
          <bbns-container :static="true"
                          url="home"
                          :load="true"
                          :notext="true"
                          title="<?=_('Help')?>"
                          icon="nf nf-mdi-help_box"
          ></bbns-container>
        </bbn-router>
      </bbn-pane>
      <!-- for parser tree -->
      <bbn-pane :size="220"
                :collapsible="true"
                :collapsed="true"
                :resizable="true"
      >
        <div class="bbn-flex-height">
          <div class="bbn-spadded">
            <bbn-button @click="getTreeParser"
                        icon="nf nf-mdi-file_tree"
                        title="<?=_("Structure Element")?>"
                        class="bbn-w-100"
            ></bbn-button>
          </div>
          <appui-ide-parser v-if="treeParser"
                            :source="sourceTreeParser"
          ></appui-ide-parser>
          <div v-else
               class="bbn-h-100 bbn-padded"
          >
            <div class="bbn-card bbn-vmiddle bbn-c bbn-lpadded">
              <span class="bbn-b bbn-xl bbn-c">
                <?=_("Parser class or file js in component")?>
              </span>
            </div>
          </div>
        </div>
      </bbn-pane>
    </bbn-splitter>
  </bbn-pane>
</bbn-splitter>