<bbn-form ref="new_form"
          :source="source"
          class="bbn-100"
          :buttons="[]"
>
  <div class="bbn-padded">
    <div class="bbn-form-label mvc-ele" v-if="isMVC()">Type</div>
    <div class="bbn-form-field mvc-ele" v-if="isMVC()">
      <bbn-dropdown v-bbn-fill-width ref="types" :source="types" v-model="selectedType" name="tab" required="required"></bbn-dropdown>
    </div>
    <div class="bbn-form-label">Name</div>
    <div class="bbn-form-field">
      <bbn-input type="text" name="name" v-model="name" v-bbn-fill-width required="required"></bbn-input>
      <bbn-dropdown ref="ext" :source="extensions" v-model="selectedExt" name="ext" required="required" style="width: 100px" v-if="isFile"></bbn-dropdown>
    </div>
    <div class="bbn-form-label">Path</div>
    <div class="bbn-form-field">
      <bbn-input v-bbn-fill-width type="text" name="path" v-model="path" readonly="readonly" required="required"></bbn-input>
      <div style="float: left">
        <bbn-button @click="selectDir">Browse</bbn-button>
        <bbn-button @click="setRoot">Root</bbn-button>
      </div>
    </div>
  </div>
  <div slot="footer">
    <bbn-button icon="fa fa-check" type="submit"><?=_("Save")?></bbn-button>
    <bbn-button icon="fa fa-close" @click="close"><?=_("Cancel")?></bbn-button>
  </div>
</bbn-form>
