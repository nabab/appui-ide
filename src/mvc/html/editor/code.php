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
<bbn-splitter v-else
              class="perms-splitter"
              orientation="vertical"
>
  <div :collapsible="false"
       :resizable="false"
       :scrollable="false"
       style="height: 70%"
  >
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
  <div :collapsible="false"
       :resizable="false"
       :scrollable="false"
       style="height: 30%"
  >
    <div class="k-block bbn-block bbn-100">
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
                       v-bbn-fill-width
            ></bbn-input>
            <bbn-button icon="fa fa-save"
                        @click="savePermission"
            ></bbn-button>
            <br>
            <span style="margin-top: 5px"><?=_('Help')?></span>
            <bbn-textarea style="margin: 5px 10px 0 10px"
                          v-model="permissions.help"
                          v-bbn-fill-width
            ></bbn-textarea>
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
        </bbn-scroll>
      </div>
    </div>
  </div>
</bbn-splitter>