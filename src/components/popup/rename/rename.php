<bbn-form :source="$data"
          :data="formData"
          :action="source.root + 'actions/rename'"          
          @success="onSuccess"
          :scrollable="false"
>
  <div class="bbn-grid-fields bbn-l bbn-padded">  
      <label><?=_("Name")?></label>
      <div class="bbn-flex-width">
        <bbn-input class="bbn-flex-fill"
                   v-model="new_name"
        ></bbn-input>
        <bbn-dropdown v-if="!isMVC && isFile && extensions.length"
                      :source="extensions"
                      v-model="new_ext"
                      style="width: 100px"
        ></bbn-dropdown>
      </div>
  </div>
</bbn-form>
