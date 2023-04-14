<!-- HTML Document -->

<div class="bbn-w-100 bbn-h-100">
  <bbn-form :action="root + 'editor/actions/copy'"
            :source="formData"
            @success="onSuccess"
            @failure="onFailure"
            class="bbn-m"
            :prefilled="true">
    <div class="bbn-padded bbn-grid-fields" >
      <label><?=_("Name")?></label>
      <div style="min-width: 30em;">
        <div class="bbn-flex-width">
          <bbn-input v-model="formData.name"
                     class="bbn-flex-fill bbn-right-space"></bbn-input>
        </div>
      </div>
    </div>

  </bbn-form>
</div>
