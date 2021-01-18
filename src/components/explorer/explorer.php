<!-- HTML Document -->
<bbn-splitter orientation="vertical" class="appui-ide-finder">
  <bbn-pane :size="40" class="bbn-bordered-bottom">
    <div class="bbn-overlay bbn-middle">

      <div class="bbn-flex-width">
        <!--div class="bbn-hpadded">
          <bbn-dropdown placeholder="<?=_('Connection')?>"
                        v-model="connection"
                        :source="source.dirs"
                        source-value="id"
                        ref="connection">
          </bbn-dropdown>
        </div-->
        <div class="bbn-hpadded">
          <bbn-button ftitle="<?=_('Is connected')?>"
                      :icon="'nf nf-fa-lightbulb_o bbn-' + (isConnected ? 'green' : 'red')"
                      @click="connect">
          </bbn-button>
        </div>
        <div class="bbn-flex-fill bbn-hpadded">
          <bbn-input placeholder="<?=_('Path')?>"
                     v-model="currentPath"
                     class="bbn-w-100"
                     :readonly="true">
          </bbn-input>
        </div>
      </div>
    </div>
  </bbn-pane>
  <bbn-pane :scrollable="false">
    <bbn-finder :source="source.root + 'finder'"
                :origin="source.origin"
                @change="updatePath"
                :default-path="path"
                :root="source.root"
    ></bbn-finder>
  </bbn-pane>
</bbn-splitter>