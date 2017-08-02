<bbn-code v-if="!isMVC || (isMVC && (tab !== 'php'))"
          v-model="value"
          :mode="mode"
          :cfg="{
            selections: selections,
            marks: marks,
            save: save,
            test: test
          }"
          ref="editor"
></bbn-code>
<bbn-splitter v-else class="bbn-full-height perms-splitter" orientation="vertical">
  <div :collapsible="false" :resizable="false" :scrollable="false" style="height: 70%">
    <bbn-code v-model="value"
              :mode="mode"
              :cfg="{
                selections: selections,
                marks: marks,
                save: save,
                test: test
              }"
              ref="editor"
    ></bbn-code>
  </div>
  <div :collapsible="false" :resizable="false" style="height: 30%; overflow: auto">
    <div class="k-block" style="height: 100%">
      <div class="k-header bbn-c"><?=('Permissions setting')?></div>
      <div style="padding: 10px">
        <div>
          <bbn-button icon="fa fa-save" @click="save"></bbn-button>
          <label><?=_('Code')?></label>
          <bbn-input :readonly="true"
                     style="margin: 0 10px"
                     :value="permissions.code"
          ></bbn-input>
          <label><?=_('Title/Description')?></label>
          <bbn-input maxlength="255"
                     style="width:400px; margin: 0 10px"
                     v-model="permissions.text"
                     @keydown.enter.prevent="savePermission"
          ></bbn-input>
          <bbn-button icon="fa fa-save" @click="savePermission"></bbn-button>
          <br>
          <label style="margin-top: 5px"><?=_('Help')?></label>
          <bbn-textarea style="margin: 5px 10px 0 10px; width: 90%"
                        v-model="permissions.help"
          ></bbn-textarea>
        </div>
        <div class="k-block" style="margin-top: 10px">
          <div class="k-header bbn-c"><?=_('Children permissions')?></div>
          <div style="padding: 10px">
            <div>
              <label><?=_('Code')?></label>
              <bbn-input style="margin: 0 10px"
                         maxlength="255"
                         ref="perm_child_code"
              ></bbn-input>
              <label><?=_('Title/Description')?></label>
              <bbn-input maxlength="255"
                         style="width:400px; margin: 0 10px"
                         @keydown.enter.prevent="addChildPermission"
                         ref="perm_child_text"
              ></bbn-input>
              <bbn-button icon="fa fa-plus" @click="addChildPermission"></bbn-button>
            </div>
            <ul v-for="c in permissions.children" style="list-style: none; padding: 0">
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
    </div>
  </div>
</bbn-splitter>