<bbn-code v-if="(!isMVC || isMVC) && !settingFormPermissions"
          v-model="value"
          :mode="mode"
          :cfg="{
            selections: selections,
            marks: marks,
            save: save,
            test: test
          }"
          @ready="setState"
          ref="editor"
></bbn-code>
<div v-else>
  <div class="k-block bbn-block bbn-100 bbn-full-screen">
    <div class="k-header bbn-c"><?=('Permissions setting')?></div>
      <div class="bbn-block bbn-hspadded bbn-100">
      <bbn-scroll>
        <div class="bbn-block bbn-w-100">
          <span><?=_('Code')?></span>
          <bbn-input readonly="readonly"
                     style="margin: 0 10px"
                     :value="permissions.code"
          ></bbn-input>
          <span><?=_('Title/Description')?></span>
          <bbn-input maxlength="255"
                     style="width:400px; margin: 0 10px"
                     v-model="permissions.text"
                     @keydown.enter.prevent="savePermission"
          ></bbn-input>
          <bbn-button icon="fa fa-save"
                      @click="savePermission"
          ></bbn-button>
          <br>
          <span style="margin-top: 5px"><?=_('Help')?></span>
          <bbn-markdown class="bbn-iblock"
                   style="margin: 5px 10px 0 10px; width: 95%; vertical-align: top"
                   v-model="permissions.help"
          ></bbn-markdown>
          <!--<bbn-textarea style="margin: 5px 10px 0 10px"
                        v-model="permissions.help"
                        v-bbn-fill-width
          ></bbn-textarea>-->
        </div>
        <div class="k-block bbn-block bbn-w-100" style="margin-top: 10px">
          <div class="k-header bbn-c"><?=_('Children permissions')?></div>
          <div class="bbn-hspadded bbn-block bbn-w-100">
            <div class="bbn-w-100">
              <span><?=_('Code')?></span>
              <bbn-input style="margin: 0 10px"
                         maxlength="255"
                         ref="perm_child_code"
              ></bbn-input>
              <span><?=_('Title/Description')?></span>
              <bbn-input maxlength="255"
                         style="margin: 0 10px; width: 60%"
                         @keydown.enter.prevent="addChildPermission"
                         ref="perm_child_text"

              ></bbn-input>
              <bbn-button icon="fa fa-plus"
                          @click="addChildPermission"
              ></bbn-button>
            </div>
            <div class="bbn-block bbn-w-100">
              <ul v-for="c in permissions.children"
                  style="list-style: none"
                  class="bbn-no-padding"
              >
                <li>
                  <div style="margin-bottom: 5px">
                    <label><?=_('Code')?></label>
                    <bbn-input v-model="c.code"
                               @keydown.enter.prevent="saveChildPermission"
                               style="margin: 0 10px"
                               maxlength="255"
                               readonly="readonly"
                    ></bbn-input>
                    <label><?=_('Title/Description')?></label>
                    <bbn-input maxlength="255"
                               style="width:400px; margin: 0 10px"
                               v-model="c.text"
                               @keydown.enter.prevent="saveChildPermission($event)"
                    ></bbn-input>
                    <bbn-button @click="saveChildPermission($event)"
                                icon="fa fa-save"
                                style="margin-right: 5px"
                    ></bbn-button>
                    <bbn-button @click="removeChildPermission($event)" icon="fa fa-trash"></bbn-button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="bbn-block bbn-w-100 k-block">
          <div class="k-header bbn-c"><?=_('Internal messages')?></div>
          <div class="bbn-w-100 bbn-padded" style="min-height: 500px">
            <div v-if="source.imessages && source.imessages.length"
                 style="margin-bottom: 1rem"
            >
              <div><strong><?=_('EXISTING')?></strong></div>
              <div v-for="imess in source.imessages"
                   class="bbn-p"
                   style="margin-left: 1rem"
                   @click="editImessage(imess)"
              >
                <span v-text="imess.title"></span>
                |
                <span><?=_('Start')?>: {{imess.start || 'x'}}</span>
                |
                <span><?=_('End')?>: {{imess.end || 'x'}}</span>
              </div>
            </div>
            <bbn-form action=""
                      :buttons="[]"
                      :source="imessage"
                      :fixed-footer="false"
                      :scrollable="false"
            >
              <div class="bbn-flex-width"
                   style="margin-bottom: 10px"
              >
                <span style="margin-right: 10px"><?=_('Title')?></span>
                <bbn-input class="bbn-flex-fill"
                           v-model="imessage.title"
                           required="required"
                ></bbn-input>
                <bbn-button icon="fa fa-save"
                            @click="saveImessage"
                            :title="saveButtonText"
                            style="margin-left: 10px"
                ></bbn-button>
                <bbn-button icon="fa fa-plus"
                            @click="newImessage"
                            title="<?=_('New')?>"
                ></bbn-button>
              </div>
              <div style="margin-bottom: 10px">
                <span style="margin-right: 10px"><?=_('Start')?></span>
                <bbn-datetimepicker v-model="imessage.start"
                                    :min="today"
																		@change="changeStart"
                ></bbn-datetimepicker>
                <span style="margin: 0 10px"><?=_('End')?></span>
                <bbn-datetimepicker v-model="imessage.end"
                                    :min="today"
                ></bbn-datetimepicker>
              </div>
              <bbn-markdown v-model="imessage.content"
                            required="required"
              ></bbn-markdown>
            </bbn-form>
          </div>
        </div>
      </bbn-scroll>
      </div>
  </div>
</div>
