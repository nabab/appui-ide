<!-- HTML Document -->

<div class="appui-ide-cls-testor bbn-overlay bbn-padding">
  <bbn-scroll>
    <div class="bbn-overlay" v-if="installed">
      <bbn-loader v-if="isLoading"/>
      <div v-else class="bbn-overlay">
        <div class="bbn-100 bbn-small bbn-flex-height">
          <div v-if="hasMeth" class="bbn-padding">
            <h3>
              <?= _("Click the button bellow to see other Test class functions") ?>
            </h3>
            <bbn-button title="view"
                        :label="_('View Other Functions')"
                        icon="nf nf-mdi-playlist_plus"
                        class="bbn-primary bbn-white"
                        @click.stop="editTestMethods"></bbn-button>
          </div>
          <div class="bbn-flex-fill bbn-padding">
            <bbn-table v-if="infos"
                     :scrollable="true"
                     :source="tableTestSource"
                     ref="table">
            <bbns-column label="<?= _("Methods") ?>"
                         :width="300"
                         field="method"/>
            <bbns-column label="<?= _("Available Tests") ?>"
                         :width="200"
                         type="number"
                         field="available_tests"/>
            <bbns-column label="<?= _("Tests Results") ?>"
                         field="last_results"
                         :render="renderTests"/>
          </bbn-table>
          </div>
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
