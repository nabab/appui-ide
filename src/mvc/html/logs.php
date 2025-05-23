<!-- HTML Document -->
<div class="bbn-overlay bbn-flex-height">
  <div class="bbn-flex-items bbn-w-100 bbn-spadding bbn-header">
    <div>
      <span v-if="fileLog.length"
            class="bbn-b bbn-middle bbn-xl"
            v-text="_('File Log') + ':' +  '  ' + fileLog"/>
      <span v-else
            class="bbn-b bbn-middle bbn-xl">
        <?= _('Manager Log') ?>s
      </span>
    </div>
    <div class="bbn-r">
      <bbn-checkbox label="<?= _('Auto') ?>"
                    v-model="autoRefreshFile"
                    :value="!autoRefreshFile"/>
      &nbsp;
     <bbn-dropdown :source="listLignes"
                    v-model="lignes"
                    style="width: 150px"/>
      &nbsp;
      <bbn-button @click="deleteFile"
                  icon="nf nf-md-delete_sweep"
                  label="<?= _('Delete File') ?>"/>
      &nbsp;
      <bbn-button @click="onChange(1)"
                  icon="nf nf-fa-file"
                  label="<?= _('Clear file') ?>"/>
      &nbsp;
      <bbn-button @click="onChange()"
                  icon="nf nf-oct-sync"
                  label="<?= _('Refresh') ?>"/>
      &nbsp;
      <bbn-dropdown :source="themes"
                    v-model="theme"
                    style="width: 150px"
                    class="bbn-c"
                    v-if="themes.length"/>
    </div>
  </div>
  <div class="bbn-flex-fill">
    <bbn-splitter class="bbn-code-container"
                  :resizable="true"
                  :collapsible="true"
                  orientation="horizontal">
      <bbn-pane :size="350"
                :collapsible="true"
                :resizable="true">
        <div class="bbn-flex-height">
          <div class="bbn-w-100 bbn-vmiddle bbn-vspadding bbn-header">
            <bbn-button title="<?= _('Refresh') ?>"
                        @click="treeReload()"
                        label="<?= _('Refresh files list') ?>"
                        icon="nf nf-oct-sync"/>
          </div>
          <div class="bbn-flex-fill" >
            <div class="bbn-overlay">
              <!-- <bbn-tree :source="source.root + 'tree_logs'"
                        @select="selectLogFile"
                        ref="listFilesLog"
                        :min-expand-level="1"
              ></bbn-tree> -->
              <bbn-tree :source="sourceTree"
                        :cls="treeClass"
                        @select="selectLogFile"
                        ref="listFilesLog"
                        :min-expand-level="1"
                        v-if="sourceTree.length"
                        @ready="setFileLog"/>
            </div>
          </div>
        </div>
      </bbn-pane>
      <bbn-pane :collapsible="true"
                :resizable="true"
                :scrollable="false">
        <div v-if="text && text.length" class="bbn-overlay">
          <bbn-code :mode="type"
                    bbn-model="text"
                    :readonly="true"
                    ref="code"
                    @hook:mounted="$refs.code.scrollBottom"
                    class="bbn-overlay"/>
        </div>
        <div v-else class="bbn-overlay bbn-middle">
          <div class="bbn-xxxxl"><?= _('Empty file content') ?></div>
        </div>
      </bbn-pane>
    </bbn-splitter>
  </div>
</div>
