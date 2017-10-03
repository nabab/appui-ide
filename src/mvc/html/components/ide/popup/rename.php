<!-- OLD

<bbn-form class="bbn-full-screen">
  <div class="bbn-w-100" v-bbn-fill-height>
  <div class="bbn-form-label"><?=_("Name")?></div>
  <div class="bbn-form-field">
    <bbn-input v-model="newName" v-bbn-fill-width></bbn-input>
    <bbn-dropdown v-if="!isMVC() && isFile"
                  class="bbn-block"
                  :source="extensions()"
                  v-model="newExt"
                  style="width: 100px"
    ></bbn-dropdown>
    </div>
  </div>
  <div class="bbn-block bbn-w-100 k-edit-buttons k-state-default" align="right" style="bottom: 0">
    <bbn-button type="button" icon="fa fa-edit" @click="submit"><?=_("Save")?></bbn-button>
    <bbn-button type="button" icon="fa fa-close" @click="close"><?=_("Cancel")?></bbn-button>
  </div>
</bbn-form>
-->

<bbn-form ref="rename_form"
          :source="source"
          class="bbn-100"
          :buttons="[{
            text: '<?=_("Save")?>',
            icon: 'fa fa-check',
            command: submit
            }, {
            text: '<?=_("Cancel")?>',
            icon: 'fa fa-close',
            command: close
          }]"

>
  <div class="bbn-padded">
    <div class="bbn-form-label"><?=_("Name")?></div>
    <div class="bbn-form-field bbn-flex-width">
      <bbn-input v-model="newName" class="bbn-flex-fill"></bbn-input>
      <bbn-dropdown v-if="!isMVC && isFile"
                    class="bbn-block"
                    :source="extensions()"
                    v-model="newExt"
                    style="width: 100px"
      ></bbn-dropdown>
    </div>
  </div>
  <!--<div slot="footer">
    <bbn-button icon="fa fa-check" @click="submit"><?=_("Save")?></bbn-button>
    <bbn-button icon="fa fa-close" @click="close"><?=_("Cancel")?></bbn-button>
  </div>-->
</bbn-form>
