<bbn-form class="bbn-full-screen"
          :source="$data"
          :data="formData"
          :action="source.root + 'actions/create'"
          @success="onSuccess"
          @failure="failureActive"
>

  <div class="bbn-padded bbn-flex-height">
    <div class="bbn-flex-fill bbn-grid-fields">

      <label v-if="isMVC"><?=_("Type")?></label>
      <div  v-if="isMVC">
        <bbn-dropdown :source="types"
                      v-model="tab"
                      required="required"
                      class="bbn-w-100"
        ></bbn-dropdown>
      </div>

      <label><?=_("Name")?></label>
      <div>
        <bbn-input v-model="name"
                   required="required"
        ></bbn-input>
        <bbn-dropdown :source="extensions"
                      v-model="extension"
                      required="required"
                      style="width: 100px"
                      v-if="source.isFile"
        ></bbn-dropdown>
      </div>

      <label><?=_("Path")?></label>
      <div>
        <bbn-input v-model="path"
                   readonly="readonly"
                   required="required"
        ></bbn-input>
        <span>
          <bbn-button @click="selectDir"><?=_("Browse")?></bbn-button>
          <bbn-button @click="() => {path = './'}"><?=_("Root")?></bbn-button>
        </span>
      </div>

    </div>
  </div>
</bbn-form>