<div class="bbn-overlay bbn-block">
  <bbn-toolbar class="bbn-r">
    <div style="margin-:2px">
      <bbn-button title="<?=_('Save')?>"
                  icon="nf nf-fa-save"
                  @click="savePermission"
                  bcolor="bbn-green"
      ></bbn-button>
    </div>
  </bbn-toolbar>
  <div style="height: 600px">
    <bbn-markdown style="margin: 5px 10px 0 10px; width: 95%; vertical-align: top; height: 100%"
                  v-model="source.help"
    ></bbn-markdown>
  </div>
</div>
