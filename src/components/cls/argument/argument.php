<!-- HTML Document -->

<div class="appui-ide-cls-argument bbn-overlay">
	<bbn-form :source="source"
            :scrollable="true"
            mode="big">
    <div class="bbn-grid-fields">
      <label class="bbn-lg"><?= _("Variable's name") ?></label>
      <bbn-input class="bbn-lg"
                 v-model="source.name"/>

      <label><?= _("Type") ?></label>
      <bbn-combo v-model="source.type"
                 :source="types"/>

      <label><?= _("Description") ?></label>
      <bbn-input v-model="source.description"/>

      <label><?= _("Reference") ?></label>
      <bbn-checkbox v-model="source.ref"/>

      <label><?= _("Default value") ?></label>
      <div class="bbn-w-100">
        <bbn-code v-model="source.default"
                  :fill="false"
                  mode="purephp"/>
      </div>
    </div>
  </bbn-form>
</div>
