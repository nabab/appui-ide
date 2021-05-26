<bbn-form ref="new_form"
          :source="source"
          class="bbn-overlay"
          :buttons="[]"
>
  <div class="bbn-padded">
    <div class="bbn-form-label mvc-ele" v-if="isMVC"><?=_("Type")?></div>
    <div class="bbn-form-field mvc-ele" v-if="isMVC">
      <bbn-dropdown ref="types"
                    :source="types"
                    v-model="selectedType"
                    name="tab"
                    required="required"
      ></bbn-dropdown>
    </div>
    <div class="bbn-form-label"><?=_("Name")?></div>
    <div class="bbn-form-field">
      <bbn-input type="text"
                 name="name"
                 v-model="name"
                 required="required"
      ></bbn-input>
      <bbn-dropdown ref="ext"
                    :source="extensions"
                    v-model="selectedExt"
                    name="ext"
                    required="required"
                    style="width: 100px"
                    v-if="isFile"
      ></bbn-dropdown>
    </div>
    <div class="bbn-form-label"><?=_("Path")?></div>
    <div class="bbn-form-field">
      <bbn-input type="text"
                 name="path"
                 v-model="path"
                 readonly="readonly"
                 required="required"
     ></bbn-input>
      <div style="float: left">
        <bbn-button @click="selectDir"><?=_("Browse")?></bbn-button>
        <bbn-button @click="setRoot"><?=_("Root")?></bbn-button>
      </div>
    </div>
  </div>
  <div slot="footer">
    <bbn-button icon="nf nf-fa-check" type="submit"><?=_("Save")?></bbn-button>
    <bbn-button icon="nf nf-fa-times" @click="close"><?=_("Cancel")?></bbn-button>
  </div>
</bbn-form>
