<!-- HTML Document -->

<div class="appui-ide-cls-testor bbn-overlay bbn-padding">
  <bbn-scroll>
    <bbn-loader v-if="isLoading"/>
    <div class="bbn-overlay bbn-flex-height">
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
        <div class="bbn-100 bbn-small">
          <bbn-table
                     :scrollable="true"
                     :source="tests_info"
                     ref="table">
            <bbns-column title="<?= _("Methods") ?>"
                         :width="300"
                         field="method"/>
            <bbns-column title="<?= _("Available Tests") ?>"
                         :width="200"
                         type="number"
                         field="available_tests"/>
            <bbns-column title="<?= _("Tests Results") ?>"
                         field="last_results"
                         :render="renderTests"/>
          </bbn-table>
        </div>
      </div>
    </div>
  </bbn-scroll>
</div>
