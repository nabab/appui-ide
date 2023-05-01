<!-- HTML Document -->

<div class="appui-ide-cls-editor bbn-overlay">
  <bbn-form :source="source"
            :scrollable="true"
            mode="big">
    <div class="bbn-padding">
      <h1>
        <?= _("Class") ?> <bbn-editable v-model="source.name"/>
      </h1>
      <div class="bbn-w-100">
        <bbn-markdown v-model="source.description"
                      placeholder="<?= _("Write a description for your class here") ?>"/>
      </div>
    </div>
  </bbn-form>
</div>
