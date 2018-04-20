<bbn-splitter>
  <bbn-pane :scrollable = "true">
    <bbn-table ref = "repositories_table"
               :source = "source.elements"
               class = "bbn-100"
               :sortable = "true"
               expander = "appui-ide-directories-repositories"

    >
      <bbn-column title = "<?=_("Title")?>"
                  field = "text"
                  :sortable = "false"
                  cls = "bbn-c"
      ></bbn-column>
      <bbn-column title = "<?=_("Content")?>"
                  :width = "100"
                  field = "num_children"
                  :sortable = "false"
                  cls = "bbn-c"
      ></bbn-column>
      <bbn-column title = "<?=_("Info")?>"
                  cls = "bbn-c"
                  :width = "60"
                  :buttons = "btns_repository"
      ></bbn-column>
    </bbn-table>
  </bbn-pane>
  <bbn-pane  v-if="paneInfo === true" :scrollable="true">
    <div class="bbn-full-screen bbn-padded">
      <bbn-json-editor v-model="repository.info" v-if="paneInfo === true"></bbn-json-editor>
    </div>
  </bbn-pane>
</bbn-splitter>
