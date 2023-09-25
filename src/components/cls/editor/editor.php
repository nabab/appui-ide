<!-- HTML Document -->

<div class="appui-ide-cls-editor bbn-overlay">
  <div class="bbn-overlay bbn-flex-height">
    <div class="bbn-flex-fill body bbn-padding">
      <!--div class="bbn-w-100 code" v-if="installed"-->
      <div class="bbn-w-100 code">
        <h1><?= _("Class") ?> <bbn-editable v-model="source.name"
                                            :disabled="disabled"/></h1>
        <bbn-markdown v-model="source.doc.description"
                      :disabled="!installed"
                      :readonly="disabled"
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
  <!--bbn-form :source="source"
            :scrollable="true"
            mode="big">
    <div class="bbn-padding">
      <h1>
        <?= _("Class") ?> <bbn-editable v-model="source.name"/>
      </h1>
      <div class="bbn-w-100">
        <bbn-markdown v-model="source.doc.description"
                      placeholder="<?= _("Write a description for your class here") ?>"/>
      </div>
      <div class="bbn-grid-fields bbn-top-margin">
        <template v-for="(val, tag) in source.doc.tags">
          <label v-text="tag"/>
          <bbn-input v-model="source.doc.tags[tag]"/>
        </template>
      </div>
    </div>
  </bbn-form-->
</div>
