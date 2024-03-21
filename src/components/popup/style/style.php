<bbn-form :buttons="btns">
  <div class="bbn-flex-height bbn-overlay bbn-l bbn-padded">
    <div class="bbn-smargin">
      <label><?= _('Theme') ?></label>
      <bbn-dropdown v-if="themes.length > 0"
                    :source="themes"
                    v-model="themePreview"
                    :nullable="true"
                    class="bbn-l"
      ></bbn-dropdown>
    </div>
    <div class="bbn-flex-fill bbn-smargin bbn-c">
        <bbn-code class="bbn-h-100"
                  :theme="themePreview"
                  :value="content"
                  readonly
                  v-if="themes.length > 0"
        ></bbn-code>
    </div>
  </div>
</bbn-form>

