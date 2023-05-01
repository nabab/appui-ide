<div class="bbn-overlay appui-ide-cls">
  <bbn-splitter orientation="horizontal"
                :resizable="true"
                :collapsible="true">
    <bbn-pane :size="220">
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
                  v-model="tabSelected"
                  :fill="true"/>
        <div class="bbn-flex-fill">
          <div class="bbn-overlay"
               v-show="tabSelected === 0">
            <bbn-scroll>
              <bbn-list :source="methodList"
                        @select="v => currentMethod = v.value || ''"
                        @unselect="currentMethod = ''">
                <template v-pre>
                  <div class="bbn-w-100 bbn-hspaddding bbn-vxspadding"
                       :title="source.summary">
                  	<i :class="{
                               'nf nf-oct-person': source.visibility === 'public',
                               'nf nf-fa-unlock_alt': source.visibility === 'protected',
                               'nf nf-fa-lock': source.visibility === 'private',
                               }"/>
                    <span class="bbn-left-smargin bbn-mono"
                          v-text="source.text"/>
                  </div>
                </template>
              </bbn-list>
            </bbn-scroll>
          </div>
          <div class="bbn-overlay"
               v-show="tabSelected === 1">
            <bbn-scroll>
              <bbn-list :source="propsList"
                        @select="v => currentProps = v.value || ''">
                <template v-pre>
                  <div class="bbn-w-100 bbn-hspaddding bbn-vxspadding"
                       :title="source.summary">
                  	<i :class="{
                               'nf nf-oct-person': source.visibility === 'public',
                               'nf nf-fa-unlock_alt': source.visibility === 'protected',
                               'nf nf-fa-lock': source.visibility === 'private',
                               }"/>
                    <span class="bbn-left-smargin bbn-mono"
                          v-text="source.text"/>
                  </div>
                </template>
              </bbn-list>
            </bbn-scroll>
          </div>
          <div class="bbn-overlay"
               v-show="tabSelected === 2">
            <bbn-scroll>
              <bbn-list :source="constList"
                        @select="v => currentConst = v.value || ''">
                <template v-pre>
                  <div class="bbn-w-100 bbn-hspaddding bbn-vxspadding"
                       :title="source.summary">
                  	<i :class="{
                               'nf nf-oct-person': source.visibility === 'public',
                               'nf nf-fa-unlock_alt': source.visibility === 'protected',
                               'nf nf-fa-lock': source.visibility === 'private',
                               }"/>
                    <span class="bbn-left-smargin bbn-mono"
                          v-text="source.text"/>
                  </div>
                </template>
              </bbn-list>
            </bbn-scroll>
          </div>
        </div>
      </div>
    </bbn-pane>
    <bbn-pane>
      <div class="bbn-overlay">
        <appui-newide-cls-editor v-if="!currentSelected"
                                 :source="source"/>
        <appui-newide-cls-method v-else-if="currentSelected.mode === 'method'"
                                 :source="source.methods[currentSelected.value]"/>
        <appui-newide-cls-property v-else-if="currentSelected.mode === 'prop'"
                                   :source="source.properties[currentSelected.value]"/>
        <appui-newide-cls-constant v-else-if="currentSelected.mode === 'constant'"
                                   :source="source.constants[currentSelected.value]"/>
      </div>
    </bbn-pane>
  </bbn-splitter>
</div>
