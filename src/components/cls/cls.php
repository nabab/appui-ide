<div class="bbn-overlay appui-ide-cls">
  <bbn-splitter orientation="horizontal"
                :resizable="true"
                :collapsible="true">
    <bbn-pane :size="220">
      <div class="bbn-overlay bbn-flex-height">
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
        <bbn-router :nav="true"
                    :menu="[]"
                    :breadcrumb="false"
                    :visual="false">
          <bbn-container url="reader"
                         :static="true"
                         :title="_('Reader')">
            <appui-ide-cls-editor v-if="!currentSelected"
                                     :source="source"
                                     mode="read"/>
            <appui-ide-cls-method v-else-if="currentSelected.mode === 'method'"
                                     :source="source.methods[currentSelected.value]"
                                     mode="read"/>
            <appui-ide-cls-property v-else-if="currentSelected.mode === 'prop'"
                                       :source="source.properties[currentSelected.value]"
                                       mode="read"/>
            <appui-ide-cls-constant v-else-if="currentSelected.mode === 'constant'"
                                       :source="source.constants[currentSelected.value]"
                                       mode="read"/>
          </bbn-container>
          <bbn-container url="editor"
                         :static="true"
                         :title="_('Editor')">
            <appui-ide-cls-editor v-if="!currentSelected"
                                     :source="source"
                                     mode="write"/>
            <appui-ide-cls-method v-else-if="currentSelected.mode === 'method'"
                                     :source="source.methods[currentSelected.value]"
                                     mode="write"/>
            <appui-ide-cls-property v-else-if="currentSelected.mode === 'prop'"
                                       :source="source.properties[currentSelected.value]"
                                       mode="write"/>
            <appui-ide-cls-constant v-else-if="currentSelected.mode === 'constant'"
                                       :source="source.constants[currentSelected.value]"
                                       mode="write"/>
          </bbn-container>
          <bbn-container url="test"
                         :static="true"
                         :title="_('Test')">
            <appui-ide-cls-testor v-if="!currentSelected"
                                     :source="source"
                                     mode="write"/>
            <appui-ide-cls-testor-method v-else-if="currentSelected.mode === 'method'"
                                            :source="source.methods[currentSelected.value]"
                                            :lib="source.lib"
                                            mode="write"/>
          </bbn-container>
        </bbn-router>
      </div>
    </bbn-pane>
  </bbn-splitter>
</div>
