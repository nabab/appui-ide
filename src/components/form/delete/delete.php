<!-- HTML Document -->

<div class="bbn-block bbn-padding">
  <bbn-form :action="root + 'editor/actions/delete'"
            :source="deleteSource"
            @success="onSuccess"
            class="bbn-m"
            :prefilled="true">
    <div class="bbn-padding bbn-grid-fields" >
      <label><?= _("Name") ?></label>
			<div class="bbn-wide"
           v-text="source.name"></div>
    </div>
  </bbn-form>
</div>
