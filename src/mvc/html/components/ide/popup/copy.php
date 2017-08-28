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
