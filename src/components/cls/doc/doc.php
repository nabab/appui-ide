<!-- HTML Document -->

<div class="appui-ide-cls-editor bbn-overlay">
  <div class="bbn-overlay bbn-flex-height">
    <div class="bbn-flex-fill body bbn-padding">
      <div class="bbn-w-100 code">
        <h1><?= _("Class") ?> <bbn-editable v-model="source.name"
                                            :readonly="disabled"
                                            :disabled="disabled"/></h1>
        <bbn-markdown v-model="source.doc.description"
                      :disabled="disabled"
                      placeholder="<?= _("Write a description for your class here") ?>"/>
        <div class="bbn-grid-fields bbn-top-margin">
          <template v-for="(val, tag) in source.doc.tags">
            <label v-text="tag"/>
            <bbn-input :disabled="disabled"
                       v-model="source.doc.tags[tag]"/>
          </template>
        </div>
      </div>
    </div>
  </div>
</div>
