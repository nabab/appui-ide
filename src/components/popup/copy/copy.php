<bbn-form class="bbn-full-screen"
          :source="$data"
          :data="formData"
          :action="source.root + 'actions/copy'"
          @success="onSuccess"
          @failure="failureActive"          
>
   <div class="bbn-padded bbn-flex-height">
     <div class="bbn-flex-fill bbn-grid-fields">
       <label>
         <?=_("Name")?>
       </label>
       <div>
         <bbn-input v-model="new_name"
                    class="bbn-flex-fill"
         ></bbn-input>
         <bbn-dropdown v-if="!source.isMVC && isFile"
                       style="width: 115px"
                       :source="extensions"
                       v-model="new_ext"
         ></bbn-dropdown>
       </div>

       <label>
         <?=_("Path")?>
       </label>
       <div>
         <bbn-input v-model="new_path"
                    readonly="readonly"
                    required="required"
         ></bbn-input>
         <bbn-button @click="selectDir"><?=_("Browse")?></bbn-button>
         <bbn-button @click="getRoot"><?=_("Root")?></bbn-button>
       </div>
     </div>
  </div>
</bbn-form>
