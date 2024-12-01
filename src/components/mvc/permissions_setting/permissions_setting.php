<!--div class="bbn-overlay">
  <div class="bbn-header bbn-c"><?= ('Permissions setting') ?></div>
    <div class="bbn-block bbn-hspadding bbn-100">
    <bbn-scroll>
      <div class="bbn-block bbn-w-100">
        <span><?= _('Code') ?></span>
        <bbn-input readonly="readonly"
                   style="margin: 0 10px"
                   :value="permissions.code"
        ></bbn-input>
        <span><?= _('Title/Description') ?></span>
        <bbn-input maxlength="255"
                   style="width:400px; margin: 0 10px"
                   v-model="permissions.text"
                   @keydown.enter.prevent="savePermission"
        ></bbn-input>
        <bbn-button icon="nf nf-fa-save"
                    @click="savePermission"
        ></bbn-button>
        <br>
        <span style="margin-top: 5px"><?= _('Help') ?></span>
        <bbn-markdown class="bbn-iblock"
                 style="margin: 5px 10px 0 10px; width: 95%; vertical-align: top"
                 v-model="permissions.help"
        ></bbn-markdown>
        <!--<bbn-textarea style="margin: 5px 10px 0 10px"
                      v-model="permissions.help"
                      v-bbn-fill-width
        ></bbn-textarea>-->
      <!--/div>
      <div class="bbn-block bbn-block bbn-w-100" style="margin-top: 10px">
        <div class="bbn-header bbn-c"><?= _('Children permissions') ?></div>
        <div class="bbn-hspadding bbn-block bbn-w-100">
          <div class="bbn-w-100">
            <span><?= _('Code') ?></span>
            <bbn-input style="margin: 0 10px"
                       maxlength="255"
                       ref="perm_child_code"
            ></bbn-input>
            <span><?= _('Title/Description') ?></span>
            <bbn-input maxlength="255"
                       style="margin: 0 10px; width: 60%"
                       @keydown.enter.prevent="addChildPermission"
                       ref="perm_child_text"

            ></bbn-input>
            <bbn-button icon="nf nf-fa-plus"
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
                  <label><?= _('Code') ?></label>
                  <bbn-input v-model="c.code"
                             @keydown.enter.prevent="saveChildPermission"
                             style="margin: 0 10px"
                             maxlength="255"
                             readonly="readonly"
                  ></bbn-input>
                  <label><?= _('Title/Description') ?></label>
                  <bbn-input maxlength="255"
                             style="width:400px; margin: 0 10px"
                             v-model="c.text"
                             @keydown.enter.prevent="saveChildPermission($event)"
                  ></bbn-input>
                  <bbn-button @click="saveChildPermission($event)"
                              icon="nf nf-fa-save"
                              style="margin-right: 5px"
                  ></bbn-button>
                  <bbn-button @click="removeChildPermission($event)" icon="nf nf-fa-trash"></bbn-button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </bbn-scroll>
    </div>
</div-->


<div>permision</div>
