<div class="bbn-overlay">
  <bbn-splitter>
    <bbn-pane :scrollable="false">
      <div class="bbn-flex-height">
        <div class="bbn-w-100 bbn-padding">
          <bbn-button @click="deleteAll"> <?= _('Delete all cache') ?></bbn-button>
        </div>
        <div class="bbn-flex-fill bbn-padding">
          <bbn-tree class="tree bbn-padded"
                    :source="root + 'cache'"
                    @select="getContent"
                    :menu="contextMenu"
                    :scrollable="true"
                    ref="cacheList"
                    :map="treeMapper"/>
        </div>
      </div>
    </bbn-pane>
    <bbn-pane>
      <div class="bbn-overlay bbn-padded" style="border: 0.5px solid #CCC">
        <div class="bbn-flex-height" v-if="selectedFile.length && contentCache.length">
          <div class="bbn-w-100">
            <div class="bbn-card bbn-padded bbn-l bbn-vmargin">
              <div class="bbn-grid-fields" v-if="selectedFile">
                <div class="bbn-grid-full bbn-b bbn-c" v-text="selectedFile"/>
                <label class="bbn-b" v-text="_('Creation date') + ' :'"/>
                <div v-text="selectedFileCreation"/>
                <label class="bbn-b" v-text="_('Expires') + ' :'"/>
                <div v-text="selectedFileExpire"/>
                <label class="bbn-b" v-text="_('Hash') + ' :'"/>
                <div v-text="selectedFileHash"/>
              </div>
            </div>
          </div>
          <div class="bbn-w-100 bbn-flex-fill">
            <div class="bbn-overlay">
              <bbn-json-editor v-model="contentCache"/>
            </div>
          </div>
        </div>
        <div class="bbn-overlay bbn-vmiddle bbn-padded" v-else>
          <div class="bbn-card bbn-h-100 bbn-vmiddle bbn-w-100 bbn-c">
              <span class="bbn-xxl bbn-w-100 bbn-c">
                <?= _("Select a cache file") ?>
              </span>
          </div>
        </div>
      </div>
    </bbn-pane>
  </bbn-splitter>
</div>