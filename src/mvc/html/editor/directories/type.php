<bbn-splitter>
  <bbn-pane :scrollable="true">
    <bbn-table ref="type_table"
               :source="source.elements"
               class="bbn-100"
               :sortable="true"
    >
      <bbn-column title="<?=_("Type")?>"
                  field="text"
                  cls="bbn-c"
      ></bbn-column>
      <bbn-column title="<?=_("Info")?>"
                  cls="bbn-c"
                  :width="100"
                  :buttons="btns_repository"
      ></bbn-column>
    </bbn-table>
  </bbn-pane>
  <bbn-pane  v-if="paneInfo === true" :scrollable="true">
    <div class="bbn-full-screen bbn-padded">
      <bbn-json-editor v-model="type.info" v-if="paneInfo === true"></bbn-json-editor>
    </div>
  </bbn-pane>
</bbn-splitter>
