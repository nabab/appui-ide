<!-- HTML Document -->

<div class="appui-ide-cls-property bbn-overlay">
	<bbn-form :source="source"
            :scrollable="true"
            mode="big">
    <div class="bbn-padding">
      <h1>
        <?= _("Property") ?> <bbn-editable v-if="!read" v-model="source.name"/>
        <span v-else> {{source.name}} </span>
      </h1>
      <div class="bbn-grid-fields">
        <label><?= _("Visibility") ?></label>
        <bbn-radio v-if="!read" v-model="source.visibility"
                   :source="visibilities"/>
        <h3 v-else>
          {{source.visibility}}
        </h3>

        <label><?= _("Type") ?></label>
        <bbn-combo v-if="!read" v-model="source.type"
                   :source="types"/>
				<h3 v-else>
          {{source.type}}
        </h3>
        <label><?= _("Description") ?></label>
        <bbn-input v-if="!read" v-model="source.description"/>
				<h3 v-else>
          {{source.description}}
        </h3>
        <label><?= _("Default value") ?></label>
        <div class="bbn-w-100">
          <bbn-code :readonly = "read"
                    v-model="source.default"
                    :fill="false"
                    mode="purephp"/>
        </div>
      </div>
    </div>
  </bbn-form>
</div>
