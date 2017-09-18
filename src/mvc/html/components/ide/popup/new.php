<!--<bbn-form class="bbn-full-screen">
  <div class="bbn-w-100" v-bbn-fill-height>
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
      <bbn-input v-bbn-fill-width
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
      <bbn-input v-bbn-fill-width
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
-->

<bbn-form ref="new_form"
          :data="source"
          class="bbn-100"
          :buttons="[]"
          @submit.prevent="submit"
>
  <div class="bbn-padded">
    <div class="bbn-form-label" v-if="isMVC"><?=_("Type")?></div>
    <div class="bbn-form-field" v-if="isMVC">
      <bbn-dropdown :source="types"
                    v-model="selectedType"
                    required="required"
                    class="bbn-w-100"
      ></bbn-dropdown>
    </div>
    <div class="bbn-form-label"><?=_("Name")?></div>
    <div class="bbn-form-field">
      <bbn-input class="v-bbn-fill-width"
                 v-model="name"
                 required="required"
      ></bbn-input>
      <bbn-dropdown :source="extensions"
                    v-model="selectedExt"
                    required="required"
                    style="width: 100px"
                    v-if="isFile"
      ></bbn-dropdown>
    </div>
    <div class="bbn-form-label"><?=_("Path")?></div>
    <div class="bbn-form-field">
      <bbn-input class="v-bbn-fill-width"
                 v-model="path"
                 readonly="readonly"
                 required="required"
      ></bbn-input>
      <span>
        <bbn-button @click="selectDir"><?=_("Browse")?></bbn-button>
        <bbn-button @click="() => {path = './'}"><?=_("Root")?></bbn-button>
      </span>
    </div>
  </div>
  <div slot="footer">
    <bbn-button icon="fa fa-check" type="submit"><?=_("Save")?></bbn-button>
    <bbn-button icon="fa fa-close" @click="close"><?=_("Cancel")?></bbn-button>
  </div>
</bbn-form>
