<!-- HTML Document -->

<div class="appui-ide-cls-testor bbn-overlay bbn-padding">
  <bbn-scroll>
    <bbn-loader v-if="isLoading"/>
    <div v-else class="bbn-overlay bbn-flex-height">
      <bbn-toolbar class="bbn-hpadded">
        <div class="header">
          <bbn-button v-if="!libInstalled"
                      title="Install"
                      icon="nf nf-fa-edit"
                      class="primary bbn-padding"
                      @click.stop="makeEnv">Install Test environment</bbn-button>
          <bbn-button v-if="libInstalled"
                      title="Check"
                      :notext="true"
                      icon="nf nf-fa-check_square"
                      class="check bbn-padding"></bbn-button>
          <span v-if="libInstalled">(2days ago...)</span>
          <bbn-button v-if="libInstalled"
                      title="Update"
                      icon="nf nf-md-update"
                      class="update bbn-padding"
                      @click.stop="makeEnv">Update Test environment</bbn-button>
          <bbn-button v-if="libInstalled"
                      title="Delete"
                      icon="nf nf-md-alert_remove"
                      class="delete bbn-padding"
                      @click.stop="delEnv">Delete Test environment</bbn-button>
        </div>
      </bbn-toolbar>
      <div class="bbn-flex-fill body bbn-padding">
        <div class="bbn-w-80 code">
          <h2>Pick your test to see and edit it</h2>
          <bbn-dropdown iconUp="nf nf-fa-caret_up"
                        iconDown="nf nf-fa-caret_down"
                        :source="['all', 'test_***_method']"
                        ></bbn-dropdown>
          <h4>Source Code</h4>
          <bbn-code v-model="source.code"
                    :fill="false"
                    mode="purephp"/>
          <h4>Test output</h4>
          <bbn-button title="Test"
                      icon="nf nf-cod-run_all"
                      class="test bbn-padding"
                      @click.stop="">Run Tests</bbn-button>
          <bbn-button title="Test"
                      icon="nf nf-cod-run_all"
                      class="test bbn-padding"
                      @click.stop="">Run All Tests</bbn-button>
          <br><br>
          <bbn-code v-model="source.code"
                    :fill="false"
                    mode="purephp"/>
        </div>
      </div>
    </div>
  </bbn-scroll>
</div>
