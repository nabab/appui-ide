<!-- HTML Document -->

<div class="appui-ide-cls-constant bbn-overlay">
	<bbn-form :source="source"
            :scrollable="true"
            mode="big">
    <div class="bbn-padding">
      <h1>
        <?= _("Constant") ?> <bbn-editable v-model="source.name"/>
      </h1>
      <div class="bbn-grid-fields">
        <label><?= _("Visibility") ?></label>
        <bbn-radio v-model="source.visibility"
                   :source="visibilities"/>

        <label><?= _("Type") ?></label>
        <bbn-combo v-model="source.type"
                   :source="types"/>

        <label><?= _("Description") ?></label>
        <bbn-input v-model="source.description"/>

        <label><?= _("Default value") ?></label>
        <div class="bbn-w-100">
          <bbn-code v-model="source.default"
                    :fill="false"
                    mode="purephp"/>
        </div>
      </div>
    </div>
  </bbn-form>
</div>
