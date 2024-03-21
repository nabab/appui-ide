<div class="bbn-block bbn-100">
  <bbn-scroll>
    <div class="bbn-grid-fields bbn-padded">
      <label><?= _('Code') ?></label>
      <div>
        <bbn-input style="margin: 0 10px"
                   maxlength="255"
                   ref="perm_child_code"
        ></bbn-input>
      </div>
      <label>
        <?= _('Title/Description') ?>
      </label>
      <div class="bbn-flex-width">
        <bbn-input maxlength="255"
                   style="margin: 0 10px"
                   @keydown.enter.prevent="addChildPermission"
                   ref="perm_child_text"
                   class="bbn-flex-fill"
        ></bbn-input>
        <bbn-button icon="nf nf-fa-plus"
                    @click="addChildPermission"
        ></bbn-button>
      </div>
    </div>
    <div class="bbn-header bbn-w-100 bbn-c bbn-b">
      <?= _('Children Permissions') ?>
    </div>
    <ul v-for="perm in source.children"
        style="list-style: none"
        class="bbn-padded"
    >
      <li class="bbn-c bbn-padded">
        <div style="margin-bottom: 5px">
          <label><?= _('Code') ?></label>
          <bbn-input v-model="perm.code"
                     @keydown.enter.prevent="saveChildPermission"
                     style="margin: 0 10px"
                     maxlength="255"
                     readonly="readonly"
          ></bbn-input>
          <label><?= _('Title/Description') ?></label>
          <bbn-input maxlength="255"
                     style="width:400px; margin: 0 10px"
                     v-model="perm.text"
                     @keydown.enter.prevent="saveChildPermission($event)"
          ></bbn-input>
          <bbn-button @click="saveChildPermission($event)"
                      icon="nf nf-fa-save"
                      style="margin-right: 5px"
          ></bbn-button>
          <bbn-button @click="removeChildPermission($event)"
                      icon="nf nf-fa-trash"
          ></bbn-button>
        </div>
      </li>
    </ul>
  </bbn-scroll>
</div>
