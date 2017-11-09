<bbn-form class="bbn-full-screen"
          :source="$data"
          :data="formData"
          :action="source.root + 'actions/rename'"
          @success="onSuccess"
>
  <div class="bbn-padded bbn-flex-height">
    <div class="bbn-flex-fill bbn-grid-fields">
      <label><?=_("Name")?></label>
      <div>
        <bbn-input v-model="new_name"></bbn-input>
        <bbn-dropdown v-if="!isMVC && isFile"
                      class="bbn-w-100"
                      :source="extensions"
                      v-model="new_ext"
                      style="width: 100px"
        ></bbn-dropdown>
      </div>
    </div>
  </div>
</bbn-form>




<!--
<bbn-form class="bbn-full-screen"
          :source="$data"
          :data="formData"
          :action="source.root + 'actions/rename'"
          @validation="beforeSubmit"
          @success="onSuccess"
>
  <div class="bbn-padded bbn-flex-height">
    <div class="bbn-flex-fill bbn-grid-fields">
      <label><?=_("Name")?></label>
      <div>
        <bbn-input v-model="new_name"></bbn-input>
        <bbn-dropdown v-if="!isMVC && isFile"
                    class="bbn-w-100"
                    :source="extensions"
                    v-model="new_ext"
                    style="width: 100px"
        ></bbn-dropdown>
      </div>
    </div>
  </div>
</bbn-form>
-->



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
