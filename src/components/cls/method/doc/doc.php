<!-- HTML Document -->

<div class="appui-ide-cls-method bbn-overlay">
  <bbn-scroll v-if="ready">
    <div class="bbn-overlay bbn-flex-height">
      <div class="bbn-flex-fill body bbn-padding">
        <div class="bbn-w-100 code">
          <bbn-button title="Return"
                    text="Back"
                    class="bbn-red"
                    :icon="'nf nf-fa-angle_left'"
                    @click.stop="goBack"></bbn-button>
          <h1>
            <?= _("Method") ?> <bbn-editable v-model="source.name"
                                             :readonly="true"
                                             :disabled="true"/>
          </h1>
          <h2>
            <bbn-input v-model="source.summary"
                       placeholder="<?= _("Summary") ?>"
                       class="bbn-w-100"
                       :readonly="!installed"/>
          </h2>
          <div class="bbn-w-100 bbn-small bbn-vmargin">
            <bbn-table v-if="source.arguments"
                       :scrollable="false"
                       :source="Object.values(source.arguments)">
              <bbns-column title="<?= _("Argument") ?>"
                           field="name"
                           :width="150"
                           :render="renderArgName"/>
              <bbns-column title="<?= _("Type") ?>"
                           :width="120"
                           field="type"
                           :render="renderArgType"/>
              <bbns-column title="<?= _("Req.") ?>"
                           :width="50"
                           ftitle="<?= _("Required") ?>"
                           field="required"
                           type="bool"/>
              <bbns-column title="<?= _("Default") ?>"
                           :width="150"
                           field="default"
                           :render="renderArgDefault"/>
              <bbns-column title="<?= _("Description") ?>"
                           component="appui-ide-cls-argument-description"
                           field="description"/>
            </bbn-table>
          </div>

          <div class="bbn-grid-fields">
            <label><?= _("Description") ?></label>
            <bbn-markdown v-model="source.description"
                          :autosize="true"
                          :disabled="!installed"
                          :readonly="!installed"/>
            <template v-for="(p, index) in source.description_parts" v-if="p.type === 'code'">
              <label><?= _("Example") ?>
                <bbn-button title="remove"
                            :notext="true"
                            icon="nf nf-mdi-delete_forever"
                            class="bbn-bg-red bbn-white"
                            :disabled="!installed"
                            @click.stop="deleteExample(index)"></bbn-button></label>
              <div>
                <bbn-code v-model="p.content"
                          :fill="false"
                          :readonly="!installed"
                          mode="purephp"/>
              </div>
            </template>
            <br>
            <bbn-button title="Add Example"
                        text="Add Example"
                        icon="nf nf-oct-diff_added"
                        class="bbn-bg-blue bbn-white"
                        style="max-width: 130px;"
                        :disabled="!installed"
                        @click.stop="addingExample = !addingExample"></bbn-button>
            <label v-if="addingExample"><?= _("New Example") ?></label>
            <div v-if="addingExample">
              <bbn-code v-model="exampleCode"
                        :fill="false"
                        :readonly="!installed"
                        mode="purephp"/>
              <br>
              <bbn-button title="Save"
                          text="Save"
                          icon="nf nf-fa-save"
                          class="bbn-state-selected bbn-white"
                          style="max-width: 130px;"
                          :disabled="!installed"
                          @click.stop="addExample"></bbn-button>
            </div>
            <br>
            <bbn-button title="Modify"
                  text="Save Modifications"
                  icon="nf nf-fa-check_circle"
                  class="bbn-state-selected bbn-padding bbn-white sub"
                  style="max-width: 200px;"
                  :disabled="!installed"
                  @click.stop="saveClass"></bbn-button>
          </div>
        </div>
      </div>
    </div>
  </bbn-scroll>
</div>