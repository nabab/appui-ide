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
           class="bbn-b"
    ><?=_("Delete File")?>:</label>
    <label v-else-if="source.data.is_vue"
           class="bbn-b"
    ><?=_("Delete Component")?>:</label>
    <label v-else
           class="bbn-b"
    ><?=_("Delete folder")?>:</label>
    <span class="bbn-vmiddle" v-text="source.name"></span>
    <div  v-if="showPannel"
          class="bbn-vmiddle"
    >
      <span v-if="source.is_mvc"
               class="bbn-b"
      ><?=_("Delete all MVC")?>:</span>
      <span v-else-if="source.data.is_vue"
             class="bbn-b"
      ><?=_("Delete all component")?>:</span>
      <span v-else
             class="bbn-b"
      ><?=_("Delete all folder")?>:</span>
      <bbn-checkbox v-model= "formData.all"
                    :value="true"
                    :novalue="false"
                    style="margin-left: 6px"
      ></bbn-checkbox>
    </div>
    <div v-if="showPannel"
        class="bbn-vmiddle"
    >
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
