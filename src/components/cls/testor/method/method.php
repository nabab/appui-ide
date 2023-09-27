<!-- HTML Document -->

<div class="appui-ide-cls-testor bbn-overlay bbn-padding">
  <bbn-scroll>
    <div class="bbn-overlay bbn-flex-height" v-if="installed">
      <bbn-loader v-if="isLoading"/>
      <div v-else class="bbn-flex-fill body bbn-padding">
        <bbn-button title="Return"
                    text="Back"
                    class="bbn-red"
                    :icon="'nf nf-fa-angle_left'"
                    @click.stop="goBack"></bbn-button>
        <br>
        <h1>
          <?= _("Method") ?> <bbn-editable v-model="source.name"
                                           :readonly="!installed"
                                           :disabled="true"/>
        </h1>
        <div class="bbn-w-100 code" v-if="test_num !== 0">
          <h2>Pick your test to see and edit it</h2>
          <div class="bbn-flex-width">
            <bbn-dropdown class="bbn-flex-fill"
                          iconUp="nf nf-fa-caret_up"
                          iconDown="nf nf-fa-caret_down"
                          :source="testFunctionsList"
                          v-model="currentTestFunction"
                          style="max-width: 1000px;"
                          ></bbn-dropdown>
            <span class="cdrop">{{ test_num }} test(s) available</span>
          </div>

          <h4>Source Code <bbn-button :notext="true"
                                      title="ViewCode"
                                      :icon="viewSource ? 'nf nf-fa-eye_slash' : 'nf nf-fa-eye'"
                                      class="bbn-state-selected"
                                      @click.stop="viewSource = !viewSource"></bbn-button></h4>
          <bbn-code class="bbn-vmargin"
                    v-if="viewSource"
                    v-model="source.code"
                    :fill="false"
                    mode="purephp"
                    :readonly="true"
                    style="max-width: 1000px;"/>
          <h4>
            <?= _("Click the button bellow to all tests and add suggestion") ?>
          </h4>
          <bbn-button title="view"
                      :text="_('View all Tests')"
                      icon="nf nf-mdi-code_braces"
                      class="bbn-tertiary"
                      :disabled="!installed"
                      @click.stop="makeSuggestion"></bbn-button>
          <h4>Test Code</h4>
          <bbn-toolbar class="bbn-radius"
                       style="max-width: 1000px;"
                       :source="barButtons"></bbn-toolbar>
          <br><br>
          <div class="bbn-w-100">
            <bbn-code v-if="currentTestFunction !== ''"
                      v-model="currentTestCode"
                      ref="testcode"
                      :fill="false"
                      mode="purephp"
                      :readonly="readonly"
                      :writable="true"
                      style="max-width: 1000px;"/>
            <bbn-code v-else
                      v-model="newCode"
                      ref="testcode"
                      :fill="false"
                      mode="purephp"
                      :readonly="readonly"
                      :writable="true"
                      style="max-width: 1000px;"/>
          </div>
          <h4 class="bbn-vmargin bbn-w-100">Test(s) Output</h4>
          <br>
          <div class="bbn-w-100 res"
               v-html="test_results">
          </div>
        </div>
        <div class="bbn-w-100 code" v-else>
          <h2>
            <?= _("It seems they have no test for this function!") ?>
          </h2>
          <h4>Source Code <bbn-button :notext="true"
                                      title="ViewCode"
                                      :icon="viewSource ? 'nf nf-fa-eye_slash' : 'nf nf-fa-eye'"
                                      class="bbn-state-selected"
                                      @click.stop="viewSource = !viewSource"></bbn-button></h4>
          <bbn-code class="bbn-vmargin"
                    v-if="viewSource"
                    v-model="source.code"
                    :fill="false"
                    mode="purephp"
                    :readonly="true"
                    style="max-width: 1000px;"/>
          <h4>
            <?= _("Click the button bellow to see test suggestion") ?>
          </h4>
          <bbn-button title="suggests"
                      :text="_('Make Test suggestions')"
                      icon="nf nf-mdi-playlist_plus"
                      class="bbn-primary bbn-white"
                      :disabled="!installed"
                      @click.stop="makeSuggestion"></bbn-button>
        </div>
      </div>
    </div>
    <div v-else class="bbn-overlay bbn-middle">
      <div>
        <h2>
          <?= _("Verify if test environment is installed!") ?>
        </h2>
      </div>
    </div>
  </bbn-scroll>
</div>
