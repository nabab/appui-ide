<div style="height: 200px; position:relative" v-if="content.length">
  <bbn-table :source="content"
             :sortable="true"
             class="bbn-full-screen"
  >
    <bbn-column title="<?=_('Name')?>"
                field="text"
    ></bbn-column>
    <bbn-column title="<?=_('Language')?>"
                field="language"
                cls="bbn-c"
    ></bbn-column>
    <bbn-column title="<?=_('Path')?>"
                field="path"
    ></bbn-column>
    <bbn-column title="<?=_('Type')?>"
                field="alias.code"
                cls="bbn-c"
    ></bbn-column>

  </bbn-table>
</div>
