<bbn-form class="bbn-full-screen"
          :action="formAction"
          @success="success"
          @failure="failure"
          :source="source.row"
          :validation="validation"
>
  <div class="bbn-grid-fields bbn-l bbn-padded">
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
                 }, {
                   text: '<?=_("Types")?>',
                   value: 'types'
                 }]"
                 v-model="show"
      ></bbn-radio>
    </div>
    <label v-if="isTabs"><?=_('Tabs')?></label>
    <div style="height: 400px" v-if="isTabs">
      <bbn-json-editor v-model="source.row.tabs"
                       :cfg="cfgEditor"
                       ref="jsonEditor"
      ></bbn-json-editor>
    </div>
    <label v-if="isExts"><?=_('Extensions')?></label>
    <div style="height: 400px" v-if="isExts">
      <bbn-json-editor v-model="source.row.extensions"
                       :cfg="cfgEditor"
                       ref="jsonEditor"
      ></bbn-json-editor>
    </div>
    <label v-if="isProject"><?=_('Project')?></label>
    <div style="height: 400px" v-if="isProject">
      <bbn-json-editor v-model="source.row.types"
                       :cfg="cfgEditor"
                       ref="jsonEditor"
      ></bbn-json-editor>
    </div>
    <label v-if="isExts"><?=_('Extensions')?></label>
    <label v-if="isTabs && (listTabs.length > 0)"><?=_('Extensions in Tabs')?></label>
    <div v-if="isExts || isTabs">
      <bbn-dropdown v-if="listTabs.length > 0"
                    :source="tabs"
                    v-model="tabSelected"
      ></bbn-dropdown>
      <bbn-dropdown v-if="listExtensions.length > 0"
                    :source="listExtensions"
                    v-model="extension"
      ></bbn-dropdown>
      <bbn-button v-if="listExtensions.length > 0"
                  @click="editExtension"
                  icon="fas fa-edit"
      ><?=_('Edit Extension')?></bbn-button>
      <bbn-button v-if="(listTabs.length > 0 && isTabs)|| isExts"
                  @click="createExtension"
                  icon="fas fa-plus"
      ><?=_('Add Extension')?></bbn-button>
      <bbn-button v-if="listExtensions.length > 0"
                  @click="deleteExtension"
                  icon="fas fa-trash"
      ><?=_('Delete Extension')?></bbn-button>
    </div>
  </div>
</bbn-form>
