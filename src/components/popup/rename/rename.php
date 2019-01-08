<bbn-form class="bbn-full-screen"
          :source="$data"
          :data="formData"
          :action="source.root + 'actions/rename'"
          @success="onSuccess"
>
  <div class="bbn-padded bbn-grid-fields">

      <label><?=_("Name")?></label>
      <div class="bbn-flex-width">
        <bbn-input class="bbn-flex-fill"
                   v-model="new_name"
        ></bbn-input>
        <bbn-dropdown v-if="!isMVC && isFile"
                      :source="extensions"
                      v-model="new_ext"
                      style="width: 100px"
        ></bbn-dropdown>
      </div>

  </div>
</bbn-form>
