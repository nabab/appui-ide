<!-- HTML Document -->

<div class="appui-ide-cls-method bbn-overlay">
	<bbn-form :source="source"
            :scrollable="true"
            mode="big">
    <div class="bbn-padding">
      <h1>
        <?= _("Method") ?> <bbn-editable v-model="source.name"/>
      </h1>
      <div class="bbn-grid-fields">
        <label><?= _("Visibility") ?></label>
        <bbn-radio v-model="source.visibility"
                   :source="visibilities"/>

        <label><?= _("Description") ?></label>
        <bbn-markdown v-model="source.description"/>

        <label><?= _("Code") ?></label>
        <div>
          <bbn-code v-model="source.code"
                    :fill="false"
                    mode="purephp"/>
        </div>

        <!--label><?= _("Returns") ?></label>
        <bbn-combo v-model="source.returns"
                   :source="types"/-->

        <label v-if="source.examples"><?= _("Examples") ?></label>
        <div v-if="source.examples">
          <div v-for="ex in source.examples"
               class="bbn-w-100 bbn-vspadding">
            <bbn-code v-model="ex.code"
                      :fill="false"
                      mode="purephp"/>
          </div>
        </div>
      </div>
    </div>
  </bbn-form>
</div>
