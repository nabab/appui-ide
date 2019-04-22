<div class="k-block bbn-full-screen bbn-padded">
    <div class="bbn-grid-fields">
      <label><?=_('Code')?></label>
      <div>
        <bbn-input readonly="readonly"
                   style="margin: 0 10px"
                   :value="source.code"
        ></bbn-input>
      </div>
      <label>
        <?=_('Title/Description')?>
      </label>
      <div class="bbn-flex-width">
        <bbn-input maxlength="255"
                   style="margin: 0 10px"
                   v-model="source.text"
                   @keydown.enter.prevent="savePermission"
                   class="bbn-flex-fill"
        ></bbn-input>
        <bbn-button icon="nf nf-fa-save"
                    @click="savePermission"
        ></bbn-button>
      </div>
    </div>
</div>
