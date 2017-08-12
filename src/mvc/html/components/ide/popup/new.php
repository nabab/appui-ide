<bbn-form class="bbn-full-screen">
  <div class="bbn-full-height bbn-w-100">
    <div class="bbn-form-label" v-if="isMVC()"><?=_("Type")?></div>
    <div class="bbn-form-field" v-if="isMVC()">
      <bbn-dropdown :source="types"
                    v-model="selectedType"
                    required="required"
                    class="bbn-w-100"
      ></bbn-dropdown>
    </div>
    <div class="bbn-form-label"><?=_("Name")?></div>
    <div class="bbn-form-field">
      <bbn-input class="bbn-full-width"
                 v-model="name"
                 required="required"
      ></bbn-input>
      <bbn-dropdown class="bbn-block"
                    :source="extensions"
                    v-model="selectedExt"
                    required="required"
                    style="width: 100px"
                    v-if="isFile"
      ></bbn-dropdown>
    </div>
    <div class="bbn-form-label"><?=_("Path")?></div>
    <div class="bbn-form-field">
      <bbn-input class="bbn-full-width"
                 v-model="path"
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
    <bbn-button type="button" @click="submit" icon="fa fa-check"><?=_("Save")?></bbn-button>
    <bbn-button type="button" @click="close" icon="fa fa-close"><?=_("Cancel")?></bbn-button>
  </div>
</bbn-form>
