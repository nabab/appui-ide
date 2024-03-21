<div class="bbn-overlay">
  <bbn-scroll>
    <div class="bbn-w-100 bbn-padded" style="min-height: 500px">
      <div v-if="source.imessages && source.imessages.length"
           style="margin-bottom: 1rem"
      >
        <div><strong><?= _('EXISTING') ?></strong></div>
        <div v-for="imess in source.imessages"
             class="bbn-p"
             style="margin-left: 1rem"
             @click="editImessage(imess)"
        >
          <span v-text="imess.title"></span>
          |
          <span><?= _('Start') ?>: {{imess.start || 'x'}}</span>
          |
          <span><?= _('End') ?>: {{imess.end || 'x'}}</span>
        </div>
      </div>
      <bbn-form action=""
                :buttons="[]"
                :source="imessage"
                :fixed-footer="false"
      >
        <div class="bbn-flex-width"
             style="margin-bottom: 10px"
        >
          <span style="margin-right: 10px"><?= _('Title') ?></span>
          <bbn-input class="bbn-flex-fill"
                     v-model="imessage.title"
                     required="required"
          ></bbn-input>
          <bbn-button icon="nf nf-fa-save"
                      @click="saveImessage"
                      :title="saveButtonText"
                      style="margin-left: 10px"
          ></bbn-button>
          <bbn-button icon="nf nf-fa-plus"
                      @click="newImessage"
                      title="<?= _('New') ?>"
          ></bbn-button>
        </div>
        <div style="margin-bottom: 10px">
          <span style="margin-right: 10px"><?= _('Start') ?></span>
          <bbn-datetimepicker v-model="imessage.start"
                              :min="today"
                              @change="changeStart"
          ></bbn-datetimepicker>
          <span style="margin: 0 10px"><?= _('End') ?></span>
          <bbn-datetimepicker v-model="imessage.end"
                              :min="today"
          ></bbn-datetimepicker>
        </div>
        <bbn-markdown v-model="imessage.content"
                      required="required"
        ></bbn-markdown>
      </bbn-form>
    </div>
  </bbn-scroll>
</div>
