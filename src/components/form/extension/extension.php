<!-- HTML Document -->
<div class="bbn-overlay appui-ide-form-extension bbn-padding">
  <bbn-form :buttons="btns"
            :confirm-leave="false"
            :source="source"
            ref="form"
            >
    <div class="bbn-grid-fields bbn-l">
      <label><?= _('Extension') ?></label>
      <bbn-input v-model="extension.ext"
                 required="required"/>

      <label><?= _('Mode') ?></label>
      <bbn-input v-model="extension.mode"/>

      <label><?= _("Default") ?></label>
      <div style="height: 420px; max-height: 50vh">
        <bbn-code ref="codeDefault"
                  theme="pastel-on-dark"
                  mode="text"
                  class="bbn-h-100"
                  v-model="extension.default"/>
      </div>
    </div>
  </bbn-form>
</div>
