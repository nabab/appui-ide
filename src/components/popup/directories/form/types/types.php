<bbn-form :action="formAction"
          @success="success"
          @failure="failure"
          :source="source.row"
          :validation="validation"
>
  <div class="bbn-grid-fields bbn-l bbn-padding">
    <label><?= _('Text') ?></label>
    <bbn-input v-model="source.row.text"
               required="required"
    ></bbn-input>
    <label><?= _('Code') ?></label>
    <bbn-input v-model="source.row.code"></bbn-input>
    <label><?= _("Do you want to insert extensions or tabs?") ?></label>
    <div class="bbn-vmiddle">
      <bbn-radio :source="[{
                   text: '<?= _("Tab") ?>',
                   value: 'tabs'
                 }, {
                   text: '<?= _("Extensions") ?>',
                   value: 'exts'
                 }, {
                   text: '<?= _("Types") ?>',
                   value: 'types'
                 }]"
                 v-model="show"
      ></bbn-radio>
    </div>
    <label v-if="isTabs"><?= _('Tabs') ?></label>
    <div style="height: 400px" v-if="isTabs">
      <bbn-json-editor v-model="source.row.tabs"
                       :cfg="cfgEditor"
                       ref="jsonEditor"
      ></bbn-json-editor>
    </div>
    <label v-if="isProject"><?= _('Project') ?></label>
    <div style="height: 400px" v-if="isProject">
      <bbn-json-editor v-model="source.row.types"
                       :cfg="cfgEditor"
                       ref="jsonEditor"
      ></bbn-json-editor>
    </div>
    <label v-if="isExts"><?= _('Extensions') ?></label>
    <div v-if="isExts">
      <bbn-dropdown v-if="listExtensions.length"
                    :source="listExtensions"
                    class="bbn-narrow bbn-right-space"
                    placeholder="<?= _("Pick an existing extension") ?>"
                    v-model="extension"
      ></bbn-dropdown>
      <bbn-button @click="createExtension"
                  icon="nf nf-fa-plus"
      ><?= _('Add Extension') ?></bbn-button>
      <br>
      <bbn-button v-if="extension"
                  @click="editExtension"
                  icon="nf nf-fa-edit"
      ><?= _('Edit Extension') ?></bbn-button>
      <bbn-button v-if="extension"
                  @click="deleteExtension"
                  icon="nf nf-fa-trash"
      ><?= _('Delete Extension') ?></bbn-button>
    </div>

    <label v-if="isTabs"><?= _('Extensions in Tabs') ?></label>
    <div v-if="isTabs">
      <bbn-dropdown v-if="listTabs.length"
                    :source="tabs"
                    v-model="tabSelected"
                    class="bbn-right-space bbn-narrow"
      ></bbn-dropdown>
      <bbn-dropdown v-if="listExtensions.length"
                    :source="listExtensions"
                    v-model="extension"
                    class="bbn-right-space bbn-narrow"
      ></bbn-dropdown>
      <bbn-button @click="createExtension"><?= _('Add Extension') ?></bbn-button>
      <br>
      <bbn-button v-if="listExtensions.length"
                  @click="editExtension"
                  icon="nf nf-fa-edit"
      ><?= _('Edit Extension') ?></bbn-button>
      <bbn-button v-if="listExtensions.length"
                  @click="deleteExtension"
                  icon="nf nf-fa-trash"
      ><?= _('Delete Extension') ?></bbn-button>
    </div>
  </div>
</bbn-form>
