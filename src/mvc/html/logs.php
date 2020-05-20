<!-- HTML Document -->
<div class="bbn-overlay bbn-flex-height">
  <div class="bbn-flex-width bbn-w-100 bbn-spadded bbn-header">
    <div>
      <span v-if="fileLog.length"
            class="bbn-b bbn-middle bbn-xl"
            v-text="_('File Log') + ':' +  '  ' + fileLog"
      ></span>
      <span v-else
            class="bbn-b bbn-middle bbn-xl"
      >
        <?=_('Manager Log')?>s
      </span>
    </div>
    <div class="bbn-flex-fill bbn-r">
      <bbn-checkbox label="<?=_('Auto')?>"
                    v-model="autoRefreshFile"
                    :value="!autoRefreshFile"
      ></bbn-checkbox>
      &nbsp;
     <bbn-dropdown :source="listLignes"
                    v-model="lignes"
                    style="width: 150px"
      ></bbn-dropdown>
      &nbsp;
      <bbn-button @click="deleteFile"
                  icon="nf nf-mdi-delete_sweep"
                  text="<?=_('Delete File')?>"
      ></bbn-button>
      &nbsp;
      <bbn-button @click="onChange(1)"
                  icon="nf nf-fa-file"
                  text="<?=_('Clear file')?>"
      ></bbn-button>
      &nbsp;
      <bbn-button @click="onChange()"
                  icon="nf nf-oct-sync"
                  text="<?=_('Refresh')?>"
      ></bbn-button>
      &nbsp;
      <bbn-dropdown :source="themes"
                    v-model="theme"
                    style="width: 150px"
                    class="bbn-c"
                    v-if="themes.length"
      ></bbn-dropdown>
    </div>
  </div>
  <div class="bbn-flex-fill">
    <bbn-splitter class="bbn-code-container"
                  :resizable="true"
                  :collapsible="true"
                  orientation="horizontal"
    >
      <bbn-pane :size="350"
                :collapsible="true"
                :resizable="true"
      >
        <div class="bbn-flex-height">
          <div class="bbn-w-100 bbn-middle bbn-vspadded bbn-header">
            <bbn-button title="<?=_('Refresh')?>"
                        @click="treeReload()"
                        text="<?=_('Refresh files list')?>"
                        icon="nf nf-oct-sync"
            ></bbn-button>
          </div>
          <div class="bbn-flex-fill" >
            <div class="bbn-overlay">
              <!-- <bbn-tree :source="source.root + 'tree_logs'"
                        @select="selectLogFile"
                        ref="listFilesLog"
                        :min-expand-level="1"
              ></bbn-tree> -->
              <bbn-tree :source="sourceTree"
                        @select="selectLogFile"
                        ref="listFilesLog"
                        :min-expand-level="1"
                        v-if="sourceTree.length"
                        @ready="setFileLog"
              ></bbn-tree>
            </div>
          </div>
        </div>
      </bbn-pane>
      <bbn-pane :collapsible="true"
                :resizable="true"
                :scrollable="false"
      >
      <div v-if="textContent && textContent.length > 1" class="bbn-overlay">
        <bbn-code :mode="type"
                  v-model="textContent"
                  :readonly="true"
                  :theme="theme"
                  ref="code"
                  class="bbn-overlay"
        ></bbn-code>
      </div>
      <div v-else class="bbn-overlay bbn-middle">
        <div class="bbn-xxxxl"><?=_('Empty file content')?></div>
      </div>
      </bbn-pane>
    </bbn-splitter>
  </div>
</div>
