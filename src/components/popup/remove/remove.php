<bbn-form class="bbn-full-screen"
          :source="{src: source}"
          :data="formData"
          :action="source.root + 'actions/delete'"
          @success="successremoveElement"
          @failure="failureRemove"
          :prefilled="true"
          :confirm-message="message"
          ref="form"
          :buttons="btns"
>

  <div class="bbn-grid-fields bbn-l bbn-padded">
    <label v-if="source.is_file"
           class="bbn-b bbn-padded"
    ><?=_("Delete File")?>:</label>
    <label v-else-if="source.data.is_vue"
           class="bbn-b bbn-padded"
    ><?=_("Delete Component")?>:</label>
    <label v-else
           class="bbn-b bbn-padded"
    ><?=_("Delete folder")?>:</label>
    <bbn-input class="bbn-flex-fill bbn-padded"
               v-text="source.name"
    ></bbn-input>
  </div>
  <div class="bbn-padded bbn-w-100 bbn-flex-width bbn-v-middle"
       v-if="showPannel"
  >
    <div class="bbn-w-50 bbn-l bbn-vmiddle">
      <span v-if="source.is_mvc"
             class="bbn-b bbn-padded"
     ><?=_("Delete all MVC")?>:</span>
      <span v-else-if="source.data.is_vue"
             class="bbn-b bbn-padded"
      ><?=_("Delete all component")?>:</span>
      <span v-else
             class="bbn-b bbn-padded"
      ><?=_("Delete all folder")?>:</span>
      <bbn-checkbox v-model= "formData.all"
                    :value="true"
                    :novalue="false"
      ></bbn-checkbox>
    </div>
    <div class="bbn-flex-fill bbn-l bbn-vmiddle">
      <bbn-dropdown :source="list"
                    v-model="formData.section"
                    style="width: 120px"
                    :disabled="formData.all"
                    v-if="list.length > 0"
      ></bbn-dropdown>
      <bbn-dropdown v-if="exts.length && (source.is_file || source.data.is_vue)"
                    :source="exts"
                    v-model="formData.ext"
                    style="width: 100px"
                    :disabled="formData.all"
                    class="bbn-padded"
                    @dataloaded="loaded"
                    required="required"
      ></bbn-dropdown>
    </div>
  </div>
</bbn-form>
