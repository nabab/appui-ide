<div class="bbn-w-100 bbn-flex-height">
  <div class="k-header bbn-flex-width bbn-h-5 bbn-padded bbn-vmiddle">
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
        <div class="bbn-hpadded bbn-full-screen" style="border: 0.5px solid #CCC">
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
        <div class="bbn-full-screen" style="border: 0.5px solid #CCC">
          <div class="bbn-flex-height bbn-padded" v-if="selectedFile.length && contentCache.length">
            <div class="w3-card bbn-h-5 bbn-w-100 bbn-padded bbn-l bbn-vmiddle">
              <strong>
                <span v-text="selectedFile"></span>
              </strong>
            </div>
            <br>
            <div class="bbn-flex-fill">
              <bbn-json-editor v-model="contentCache"></bbn-json-editor>
            </div>
          </div>
          <div class="bbn-full-screen bbn-vmiddle bbn-padded" v-else>
            <div class="w3-card bbn-h-100 bbn-vmiddle bbn-w-100 bbn-c">
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
