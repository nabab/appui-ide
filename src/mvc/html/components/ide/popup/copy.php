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
    <div class="bbn-form-label"><?=_("Path")?></div>
    <div class="bbn-form-field">
      <bbn-input v-bbn-fill-width
                 v-model="newPath"
                 readonly="readonly"
                 required="required"
      ></bbn-input>
      <div class="bbn-block" style="margin-left: 5px">
        <bbn-button type="button" @click="selectDir"><?=_("Browse")?></bbn-button>
        <bbn-button type="button" @click="setRoot"><?=_("Root")?></bbn-button>
      </div>
    </div>
  </div>
  <div class="bbn-block bbn-w-100 k-edit-buttons k-state-default" align="right" style="bottom: 0">
    <bbn-button type="button" icon="fa fa-edit" @click="submit"><?=_("Save")?></bbn-button>
    <bbn-button type="button" icon="fa fa-close" @click="close"><?=_("Cancel")?></bbn-button>
  </div>
</bbn-form>
-->

<bbn-form ref="copy_form"
          :source="source"
          :buttons="[{
            text: '<?=_("Copy")?>',
            icon: 'fa fa-copy',
            command: submit
            }, {
            text: '<?=_("Cancel")?>',
            icon: 'fa fa-close',
            command: close
          }]"
          class="bbn-100"
>
  <div class="bbn-padded">
    <div class="bbn-form-label"><?=_("Name")?></div>
    <div class="bbn-form-field">
      <bbn-input v-model="newName" v-bbn-fill-width></bbn-input>
      <bbn-dropdown v-if="!isMVC && isFile"
                    class="bbn-block"
                    :source="extensions()"
                    v-model="newExt"
                    style="width: 100px"
      ></bbn-dropdown>
    </div>
    <div class="bbn-form-label">
      <?=_("Path")?>
    </div>
    <div class="bbn-form-field">
      <bbn-input v-bbn-fill-width
                 v-model="path"
                 readonly="readonly"
                 required="required"
      ></bbn-input>
      <div style="float:left">
        <bbn-button type="button" @click="selectDir"><?=_("Browse")?></bbn-button>
        <bbn-button @click="() => {path = './'}"><?=_("Root")?></bbn-button>
      </div>
    </div>
  </div>
</bbn-form>
