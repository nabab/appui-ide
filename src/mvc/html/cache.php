<div class="bbn-w-100 bbn-flex-height">
  <div class="k-header bbn-flex-width bbn-h-5 bbn-padded">
    <div class="bbn-l bbn-w-10">
      <bbn-button @click="deleteAll"> <?=_('Delete all')?></bbn-button>
    </div>
    <div class="bbn-flex-fill  bbn-r">
      <span class="bbn-xl">
        <strong>
          <?=_('Cache Managment')?>
        </strong>
      </span>
    </div>
  </div>
  <div class="bbn-flex-fill">
    <bbn-splitter>
      <bbn-pane>
        <div class="bbn-hpadded bbn-full-screen">
          <bbn-tree class="tree bbn-padded"
                    source='ide/data_cache'
                    @select="getContent"
                    :menu="contextMenu"
                    ref="cacheList"
                    :map="treeMapper"
          ></bbn-tree>
        </div>  
      </bbn-pane>
      <bbn-pane>
        <div class="bbn-flex-height" v-if="selectedFile.length && contentCache.length">
          <div class="bbn-h-5 bbn-w-100 bbn-l bbn-vmiddle">
            <strong>
              <span v-text="selectedFile"></span>
            </strong>
          </div>
          <div class="bbn-flex-fill">
            <bbn-json-editor v-model="contentCache"></bbn-json-editor>
          </div>
        </div>
        <div class="bbn-h-100 bbn-vmiddle" v-else>
          <span class="bbn-xxxl bbn-w-100 bbn-c">
            <strong>
              <?=_("Select a cache file")?>
            </strong>
          </span>
        </div>
      </bbn-pane>
    </bbn-splitter>
  </div>
</div>
