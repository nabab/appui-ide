<!-- HTML Document -->

<?php
/* Static classes xx and st are available as aliases of bbn\X and bbn\Str respectively */
?>

<div class="bbn-overlay">
  <bbn-splitter orientation="horizontal"
                :resizable="true"
                :collapsible="true">
    <bbn-pane size="25%">
      <div class="bbn-overlay bbn-flex-height">
        <bbn-toolbar>
          <div>
            <bbn-button :notext="true"
                        text="_('Select Class')"
                        icon='nf nf-fa-folder'/>
          </div>
          <div>
          </div>
          <div>
            <bbn-context :source="addActions">
              <bbn-button :notext="true"
                          text="_('Add ...')"
                          icon="nf nf-fa-plus">
              </bbn-button>
            </bbn-context>
          </div>
        </bbn-toolbar>
        <bbn-tabs :source="tabs"
                  v-model="tabSelected">
        </bbn-tabs>
        <div class="bbn-flex-fill">
          <div class="bbn-overlay"
               v-if="tabSelected === 0">
            <bbn-list :source="methodList"
                      :scrollable="true"
                      @select="v => currentMethod = v.value || ''"/>
          </div>
          <div class="bbn-overlay"
               v-if="tabSelected === 1">
            <bbn-list :source="propsList"
                      :scrollable="true"
                      @select="v => currentProps = v.value || ''"/>
          </div>
          <div class="bbn-overlay"
               v-if="tabSelected === 2">
            <bbn-list :source="constList"
                      :scrollable="true"
                      @select="v => currentConst = v.value || ''"/>
          </div>
        </div>
      </div>
    </bbn-pane>
    <bbn-pane>
      <div class="bbn-overlay">
      </div>
    </bbn-pane>
  </bbn-splitter>
</div>