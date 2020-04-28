<div class="bbn-w-100 bbn-flex-height">
  <div class="bbn-header bbn-flex-width bbn-h-5 bbn-padded bbn-vmiddle">
    <div class="bbn-l bbn-w-10">
      <bbn-button @click="deleteAll"> <?=_('Delete all')?></bbn-button>
    </div>
    <div class="bbn-flex-fill  bbn-r">
      <span class="bbn-xl">
        <strong>
          <?=_('Cache Management')?>
        </strong>
      </span>
    </div>
  </div>
  <div class="bbn-flex-fill">
    <bbn-splitter>
      <bbn-pane :scrollable="true">
        <div class="bbn-hpadded bbn-overlay" style="border: 0.5px solid #CCC">
          <bbn-tree class="tree bbn-padded"
                    :source="root + 'data_cache'"
                    @select="getContent"
                    :menu="contextMenu"
                    :scrollable="true"
                    ref="cacheList"
                    :map="treeMapper"
          ></bbn-tree>
        </div>
      </bbn-pane>
      <bbn-pane>
        <div class="bbn-overlay bbn-padded" style="border: 0.5px solid #CCC">
          <div class="bbn-flex-height" v-if="selectedFile.length && contentCache.length">
						<div class="bbn-w-100">
							<div class="bbn-card bbn-padded bbn-l bbn-vmargin">
                <div class="bbn-grid-fields" v-if="selectedFile">
                  <div class="bbn-grid-full bbn-b bbn-c" v-text="selectedFile"></div>
                  <label class="bbn-b" v-text="_('Creation date') + ' :'"></label>
                  <div v-text="selectedFileCreation"></div>
                  <label class="bbn-b" v-text="_('Expires') + ' :'"></label>
                  <div v-text="selectedFileExpire"></div>
                  <label class="bbn-b" v-text="_('Hash') + ' :'"></label>
                  <div v-text="selectedFileHash"></div>
                </div>
							</div>
						</div>
						<div class="bbn-w-100 bbn-flex-fill">
							<div class="bbn-overlay">
								<bbn-json-editor v-model="contentCache"></bbn-json-editor>
							</div>
						</div>
          </div>
          <div class="bbn-overlay bbn-vmiddle bbn-padded" v-else>
            <div class="bbn-card bbn-h-100 bbn-vmiddle bbn-w-100 bbn-c">
                <span class="bbn-xxxxl bbn-w-100 bbn-c">
                  <?=_("Select a cache file")?>
                </span>
            </div>
          </div>
        </div>
      </bbn-pane>
    </bbn-splitter>
  </div>
</div>