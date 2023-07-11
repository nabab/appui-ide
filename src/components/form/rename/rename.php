<!-- HTML Document -->

<div class="bbn-w-100 bbn-h-100">
  <bbn-form :action="root + 'editor/actions/rename'"
            :source="renameSource"
            @success="onSuccess"
            class="bbn-m">
    <div class="bbn-padded bbn-grid-fields" >
      <label><?=_("Name")?></label>
      <div style="min-width: 30em;">
        <div class="bbn-flex-width">
          <bbn-input v-model="name"
                     class="bbn-flex-fill bbn-right-space"></bbn-input>
        </div>
      </div>
    </div>

  </bbn-form>
</div>
