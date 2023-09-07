<!-- HTML Document -->

<div class="appui-ide-cls-testor bbn-overlay bbn-padding">
  <bbn-scroll>
    <div class="bbn-overlay bbn-flex-height" v-if="installed">
      <bbn-loader v-if="isLoading"/>
      <div class="bbn-flex-fill body bbn-padding">
        <div class="bbn-100 bbn-small">
          <bbn-table v-if="infos"
                     :scrollable="true"
                     :source="tableTestSource"
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
    <div v-else class="bbn-overlay bbn-middle">
      <div>
        <h2>
          <?= _("Verify if test environment is installed!") ?>
        </h2>
      </div>
    </div>
  </bbn-scroll>
</div>
