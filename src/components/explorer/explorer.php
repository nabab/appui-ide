<!-- HTML Document -->
<div class="bbn-overlay">
  <bbn-splitter orientation="vertical" class="appui-ide-finder">
    <bbn-pane :size="40" class="bbn-border-bottom">
      <div class="bbn-overlay bbn-middle">

        <bbn-toolbar>
          <!--div class="bbn-hpadding">
            <bbn-dropdown placeholder="<?= _('Connection') ?>"
                          v-model="connection"
                          :source="source.dirs"
                          source-value="id"
                          ref="connection">
            </bbn-dropdown>
          </div-->
          <div class="bbn-left-sspace">
            <bbn-button flabel="<?= _('Is connected') ?>"
                        :icon="'nf nf-fa-lightbulb_o bbn-' + (connected ? 'green' : 'red')"
                        @click="connect"
                        :notext="true">
            </bbn-button>
          </div>
          <div class="bbn-left-sspace">
            <bbn-button flabel="<?= _('View choice') ?>"
                        icon="nf nf-fa-eye"
                        :notext="true"
                        @click="viewMode = viewMode == 'dual' ? 'columns': 'dual'">
            </bbn-button>
          </div>
          <div class="bbn-left-sspace">
            <bbn-button flabel="<?= _('Element size') ?>"
                        icon="nf nf-md-move_resize_variant"
                        :notext="true">
            </bbn-button>
          </div>
          <div class="bbn-hpadding">
            <bbn-input placeholder="<?= _('Path') ?>"
                      v-model="currentPath"
                      class="bbn-wider"
                      :readonly="true"
                      :notext="true"/>
          </div>
        </bbn-toolbar>
      </div>
    </bbn-pane>
    <bbn-pane :scrollable="false">
      <appui-ide-finder :source="source.root + 'finder'"
                  :origin="source.origin"
                  @change="updatePath"
                  :default-path="path"
                  :root="source.root"
                  :mode="viewMode"
                  :storage="true"
                  :storage-full-name="'appui-ide-explorer-' + source.origin"/>
    </bbn-pane>
  </bbn-splitter>
</div>
