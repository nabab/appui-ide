<!-- HTML Document -->
<div class="bbn-flex-height">
  <div class="bbn-c bbn-padded">
    <bbn-checkbox label="<?=_('Auto')?>"
                  v-model="autoRefreshFile"
                  :value="!autoRefreshFile"
    ></bbn-checkbox>
      &nbsp;
    <bbn-dropdown :source="files"
                  v-model="fileLog"
                  style="width: 200px"
    ></bbn-dropdown>
    &nbsp;
   <bbn-dropdown :source="listLignes"
                  v-model="lignes"
                  style="width: 150px"
    ></bbn-dropdown>
    &nbsp;
    <bbn-button @click="onChange(1)" icon="far fa-file">
      <?=_('Clear file')?>
    </bbn-button>
    &nbsp;
    <bbn-button @click="onChange()" icon="zmdi zmdi-refresh-sync">
      <?=_('Refresh')?>
    </bbn-button>
  </div>
  <div v-if="textContent.length" class="bbn-flex-fill">
    <div class="bbn-full-screen">
      <bbn-code :mode="type" v-model="textContent" :readonly="true"></bbn-code>
    </div>
  </div>
  <div v-else>
    <span class="bbn-xxxxl"><?=_('Empty file content')?></span>
  </div>
</div>
