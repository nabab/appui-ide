<bbn-form :source="data"
          :data="formData"
          :action="source.root + 'actions/create'"
          @success="onSuccess"
          @failure="failureActive"
>

  <div class="bbn-padded bbn-flex-height">
    <div class="bbn-flex-fill bbn-grid-fields"><label><?=_("Name")?></label>
      <div class="bbn-flex-width">
        <div class="bbn-flex-fill">
          <bbn-input v-model="data.name"
                     required="required"
                     class="bbn-w-100"
          ></bbn-input>
        </div>
        <bbn-dropdown v-if="source.isFile && availableExtensions && (availableExtensions.length > 1)"
                      :source="extensions"
                      v-model="data.extension"
                      required="required"
                      style="width: 100px"
        ></bbn-dropdown>
      </div>
      <div class="bbn-grid-full" v-if="isMVC && source.isFile">
        <bbn-radio :required="true"
                   :source="templates"
                   v-model="data.template"
                  :vertical="true"/>
      </div>
      <label v-if="data.template === 'file'"><?=_("Type")?></label>
      <div  v-if="data.template === 'file'">
        <bbn-dropdown :source="types"
                      v-model="data.tab"
                      required="required"
                      class="bbn-w-100"
        ></bbn-dropdown>
      </div>
      <label><?=_("Path")?></label>
      <div class="bbn-flex-width">
        <div class="bbn-flex-fill">
          <bbn-input v-model="data.path"
                     readonly="readonly"
                     required="required"
                     class="bbn-w-100"
          ></bbn-input>
        </div>
        <div>
          <bbn-button @click="selectDir"><?=_("Browse")?></bbn-button>
          <bbn-button @click="getRoot"><?=_("Root")?></bbn-button>
        </div>
      </div>

    </div>
  </div>
</bbn-form>
