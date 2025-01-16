<!-- HTML Document -->

<div class="appui-ide-cls-method bbn-overlay">
  <bbn-scroll v-if="ready">
    <div class="bbn-overlay bbn-flex-height">
      <div class="bbn-flex-fill body bbn-padding">
        <div class="bbn-w-100 code">
          <bbn-button title="Return"
                    label="Back"
                    class="bbn-red"
                    :icon="'nf nf-fa-angle_left'"
                    @click.stop="goBack"></bbn-button>
          <h1>
            <?= _("Method") ?> <bbn-editable v-model="source.name"
                                             :readonly="!installed"
                                             :disabled="!installed"/>
          </h1>
          <!--h2>
            <bbn-input v-model="source.summary"
                       placeholder="<?= _("Summary") ?>"
                       class="bbn-w-100"
                       :readonly="!installed"/>
          </h2-->
          <div class="bbn-w-100 bbn-small bbn-vmargin">
            <bbn-table v-if="source.arguments"
                       :scrollable="false"
                       :editable="!installed"
                       :source="Object.values(source.arguments)">
              <bbns-column label="<?= _("Argument") ?>"
                           field="name"
                           :width="150"
                           :render="renderArgName"/>
              <bbns-column label="<?= _("Type") ?>"
                           :width="120"
                           field="type"
                           :render="renderArgType"/>
              <bbns-column label="<?= _("Req.") ?>"
                           :width="50"
                           flabel="<?= _("Required") ?>"
                           field="required"
                           type="bool"/>
              <bbns-column label="<?= _("Default") ?>"
                           :width="150"
                           field="default"
                           :render="renderArgDefault"/>
              <bbns-column label="<?= _("Description") ?>"
                           field="default"/>
            </bbn-table>
          </div>

          <div class="bbn-grid-fields">
            <label><?= _("Visibility") ?></label>
            <bbn-radio v-model="source.visibility"
                       :source="visibilities"
                       :disabled="true"/>
            <label><?= _("IsFinal") ?></label>
            <bbn-checkbox :value="source.final"
                          :disabled="true"
                          ></bbn-checkbox>
            <label><?= _("Code") ?><bbn-button :notext="true"
                      title="ViewCode"
                      :icon="viewSource ? 'nf nf-fa-eye_slash' : 'nf nf-fa-eye'"
                      class="bbn-state-selected"
                      @click.stop="viewSource = !viewSource"></bbn-button></label>
            <div v-if="viewSource">
              <bbn-toolbar class="bbn-radius"
                           style="max-width: 1000px;"
                           :disabled="!installed"
                           :source="barButtons"></bbn-toolbar>
              <br><br>
              <bbn-code v-model="code.current"
                        ref="srccode"
                        :fill="false"
                        :readonly="readonly"
                        mode="purephp"/>
              <p v-if="code.current !== source.code" class="bbn-red">
                Press the Save button (changes not saved yet ......)
              </p>
            </div>
            <div v-else>
              <br><br>
            </div>
            <label v-if="test_results != ''"><?= _("Test(s) Output    ") ?><bbn-button :notext="true"
                      title="Clear"
                      icon="nf nf-fa-remove"
                      class="bbn-tertiary"
                      @click.stop="test_results = ''"></bbn-button></label>
            <div class="bbn-w-100 res"
                 v-if="test_results != ''"
                 v-html="test_results">
            </div>
            <!--template v-for="(p, index) in source.description_parts" v-if="p.type === 'code'">
              <label><?= _("Example") ?>
                <bbn-button title="remove"
                            :notext="true"
                            icon="nf nf-md-delete_forever"
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
                        label="Add Example"
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
                          label="Save"
                          icon="nf nf-fa-save"
                          class="bbn-state-selected bbn-white"
                          style="max-width: 130px;"
                          :disabled="!installed"
                          @click.stop="addExample"></bbn-button>
            </div-->
            <br>
            <bbn-button title="Modify"
                  label="Save Modifications"
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