  <bbn-form class="bbn-full-screen"
            :action="formAction"
            @success="success"
            @failure="failure"
            :source="source.row"
            :validation="validation"
  >
    <div class="bbn-padded bbn-grid-fields">
      <label><?=_('Text')?></label>
      <bbn-input v-model="source.row.text"
                 required="required"
      ></bbn-input>

      <label><?=_('Code')?></label>
      <bbn-input v-model="source.row.code"></bbn-input>

      <label><?=_("Do you want to insert extensions or tabs?")?></label>
      <div class="bbn-vmiddle">
        <bbn-radio :source="[{
                     text: '<?=_("Tab")?>',
                     value: 'tabs'
                   }, {
                     text: '<?=_("Extensions")?>',
                     value: 'exts'
                   }]"
                   v-model="show"
        ></bbn-radio>
      </div>

      <label v-if="isTabs"><?=_('Tabs')?></label>
      <label v-if="isExts"><?=_('Extensions')?></label>
      <div v-if="isTabs || isExts">
        <bbn-json-editor v-model="isTabs ? source.row.tabs : source.row.extensions"
                         :cfg="cfgEditor"
                         ref="jsonEditor"
        ></bbn-json-editor>
      </div>
    </div>
  </bbn-form>
