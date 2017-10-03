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
<!--
<bbn-form ref="new_form"
          :data="source"
          class="bbn-100"
          :action="'components/ide/popup/new'"
          :buttons="['submit', 'cancel']"
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
-->
<!--
<bbn-form :source="obj"
          :data="obj2"
          :action="source.root + 'actions/create'"
          class="bbn-100"
          @success="successActive"

>
  <div class="bbn-padded bbn-flex-height">
    <div class="bbn-flex-grows bbn-flex-grid">
      <div  v-if="isMVC"><?=_("Type")?></div>
      <div  v-if="isMVC">
        <bbn-dropdown :source="source.types"
                      v-model="obj.tab"
                      required="required"
                      class="bbn-w-100"
        ></bbn-dropdown>
      </div>
      <div><?=_("Name")?></div>
      <div>
        <bbn-input v-model="obj.name"
                   required="required"
        ></bbn-input>
        <bbn-dropdown :source="source.extensions"
                      v-model="obj.extension"
                      required="required"
                      style="width: 100px"
                      v-if="source.isFile"
        ></bbn-dropdown>
      </div>
      <div><?=_("Path")?></div>
      <div>
        <bbn-input v-model="obj.path"
                   readonly="readonly"
                   required="required"
        ></bbn-input>
        <span>
          <bbn-button @click="selectDir"><?=_("Browse")?></bbn-button>
          <bbn-button @click="() => {obj.path = './'}"><?=_("Root")?></bbn-button>
        </span>
     </div>
    </div>
  </div>
</bbn-form>-->
<bbn-form class="bbn-full-screen"
          :source="obj"
          :data="obj2"
          :action="source.root + 'actions/create'"
          @success="successActive"
>

  <div class="bbn-padded bbn-flex-height">
    <div class="bbn-flex-fill bbn-grid-fields">

      <label  v-if="isMVC"><?=_("Type")?></label>
      <div  v-if="isMVC">
        <bbn-dropdown :source="types"
                      v-model="selectedType"
                      required="required"
                      class="bbn-w-100"
        ></bbn-dropdown>
      </div>

      <label><?=_("Name")?></label>
      <div>
        <bbn-input v-model="obj.name"
                   required="required"
        ></bbn-input>
        <bbn-dropdown :source="extensions"
                      v-model="obj.extension"
                      required="required"
                      style="width: 100px"
                      v-if="source.isFile"
        ></bbn-dropdown>
      </div>

      <label><?=_("Path")?></label>
      <div>
        <bbn-input v-model="obj.path"
                   readonly="readonly"
                   required="required"
        ></bbn-input>
        <span>
          <bbn-button @click="selectDir"><?=_("Browse")?></bbn-button>
          <bbn-button @click="() => {obj.path = './'}"><?=_("Root")?></bbn-button>
        </span>
      </div>

    </div>
  </div>
</bbn-form>