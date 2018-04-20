<!--<div class="bbn-full-screen" v-if="source.types.length">
  <bbn-table ref="types_table"
             :source="source.types"
             class="bbn-100"
             :sortable="true"
             :toolbar="btns_toolbar"
             :showable="false"
             editor="appui-ide-popup-directories-form-types"
             :editable="true"
  >
    <bbn-column title="<?=_("Type")?>"
                field="text"
                cls="bbn-c"
    ></bbn-column>
    <bbn-column title=" "
                cls="bbn-c"
                :width="100"
                :buttons="btns_types"
    ></bbn-column>
  </bbn-table>
</div>-->
<div class="bbn-full-screen" v-if="source.types.length">
  <bbn-table ref="types_table"
             :source="source.types"
             class="bbn-100"
             :sortable="true"
             :toolbar="[{
               text: '<?=_('Add Type')?>',
               icon: 'fa fa-plus',
               command: openFormManager
             }]"
             :showable="false"
             editor="appui-ide-popup-directories-form-types"
             :editable="true"
  >
    <bbn-column field="code"
                :hidden="true"
    ></bbn-column>
    <bbn-column field="id"
                :hidden="true"
    ></bbn-column>
    <bbn-column title="<?=_("Type")?>"
                field="text"
                cls="bbn-c"
    ></bbn-column>
    <bbn-column title= "<?=_("Extensions")?>"
                field="extensions"
                :width="70"
                :render="renderIconExts"
                cls="bbn-c"
                default="[]"
    ></bbn-column>
    <bbn-column title= "<?=_("Tabs")?>"
                field="tabs"
                :width="70"
                :render="renderIconTabs"
                cls="bbn-c"
                default="{}"
    ></bbn-column>
    <bbn-column title=" "
                cls="bbn-c"
                :width="100"
                :buttons="[{
                  text: '<?=_("Modif.")?>',
                  command: editType,
                  notext: true,
                  icon: 'fa fa-pencil'
                }, {
                  text: '<?=_("Delete")?>',
                  command: deleteType,
                  icon: 'fa fa-trash',
                  notext: true
                }]"
    ></bbn-column>
  </bbn-table>
</div>
