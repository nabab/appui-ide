<div class="bbn-full-screen" v-if="source.types.length">
  <bbn-table ref="types_table"
             :source="source.types"
             class="bbn-100"
             :sortable="true"
             :toolbar="[{
               text: '<?=_('Add Type')?>',
               icon: 'nf nf-fa-plus',
               command: addType
             }]"
             :showable="false"
             editor="appui-ide-popup-directories-form-types"
             :editable="true"
  >
    <bbns-column field="code"
                 :hidden="true"
    ></bbns-column>
    <bbns-column field="id"
                 :hidden="true"
    ></bbns-column>
    <bbns-column title="<?=_("Type")?>"
                 field="text"
                 cls="bbn-c"
    ></bbns-column>
    <bbns-column title= "<?=_("Extensions")?>"
                 field="extensions"
                 :width="70"
                 :render="renderIconExts"
                 cls="bbn-c"
                 default="[]"
    ></bbns-column>
    <bbns-column title= "<?=_("Tabs")?>"
                 field="tabs"
                 :width="70"
                 :render="renderIconTabs"
                 cls="bbn-c"
                 default="[]"
    ></bbns-column>
    <bbns-column title= "<?=_("Types")?>"
                 field="types"
                 :width="70"
                 :render="renderIconTypes"
                 cls="bbn-c"
                 default="[]"
    ></bbns-column>
    <bbns-column title=" "
                 cls="bbn-c"
                 :width="150"
                 :buttons="[{
                   text: '<?=_("Edit")?>',
                   command: editType,
                   notext: true,
                   icon: 'nf nf-oct-pencil'
                 },{
                   text: '<?=_("Copy")?>',
                   command: copyType,
                   notext: true,
                   icon: 'nf nf-fa-copy'
                 },{
                   text: '<?=_("Delete")?>',
                   command: deleteType,
                   icon: 'nf nf-fa-trash',
                   notext: true
                 }]"
    ></bbns-column>
  </bbn-table>
</div>
