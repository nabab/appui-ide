<!--ul class="bbn-ide-context"></ul-->
<bbn-splitter class="bbn-ide-container" orientation="vertical">
  <div class="bbn-ide-toolbar-container" style="height: 40px" :scrollable="false">
    <bbn-toolbar class="bbn-ide">
      <div>
        <bbn-input class="ide-tree-search" placeholder="<?=_('Search file')?>"></bbn-input>
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
        <bbn-menu :source="menu"></bbn-menu>
      </div>
    </bbn-toolbar>
  </div>
  <div>
    <bbn-splitter class="bbn-code-container"
                  orientation="horizontal"
    >
      <div style="width: 200px; overflow: hidden"
           :collapsible="true"
           :resizable="true"
      >
        <div class="bbn-100">
          <bbn-tree class="tree"
                    :source="root + 'tree'"
                    @select="treeNodeActivate"
                    :menu="treeContextMenu"
                    :data="treeInitialData"
                    ref="filesList"
                    :map="treeMapper"
                    :icon-color="color"

          ></bbn-tree>
        </div>
      </div>
      <div class="bbn-no-padding"
           :collapsible="true"
           :resizable="true"
           :scrollable="false"
      >
        <div style="position: absolute; top: auto; left: auto; margin: 50%; text-align: center">
          <i class="fa fa-code"></i>
        </div>
        <bbn-tabnav id="tabstrip_editor"
                    ref="tabstrip"
                    :autoload="true"
                    @close="ctrlCloseTab"
        >
          <bbn-tab :static="true"
                   url="home"
                   load="true"
                   :title="'<i class=\'bbn-xl zmdi zmdi-pin-help\'> </i>'"
          ></bbn-tab>
        </bbn-tabnav>
      </div>
      <div style="width: 200px"
           :collapsible="true"
           :resizable="true"
           :collapsed="true">
        <iframe class="bbn-100"
                src="#"
        ></iframe>
      </div>
    </bbn-splitter>
  </div>
</bbn-splitter>