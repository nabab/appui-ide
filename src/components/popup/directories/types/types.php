<div class="bbn-overlay" v-if="source.types.length">
  <bbn-table ref="types_table"
             :source="source.types"
             :scrollable="true"
             :sortable="true"
             :toolbar="[{
               text: '<?= _('Add Type') ?>',
               icon: 'nf nf-fa-plus',
               action: addType
             }]"
             :showable="false"
             editor="appui-ide-popup-directories-form-types"
             :editable="true"
  >
    <bbns-column field="code"
                 :invisible="true"
    ></bbns-column>
    <bbns-column field="id"
                 :invisible="true"
    ></bbns-column>
    <bbns-column label="<?= _("Type") ?>"
                 field="text"
                 cls="bbn-c"
    ></bbns-column>
    <bbns-column label= "<?= _("Extensions") ?>"
                 field="extensions"
                 :width="70"
                 :render="renderIconExts"
                 cls="bbn-c"
                 default="[]"
    ></bbns-column>
    <bbns-column label= "<?= _("Tabs") ?>"
                 field="tabs"
                 :width="70"
                 :render="renderIconTabs"
                 cls="bbn-c"
                 default="[]"
    ></bbns-column>
    <bbns-column label= "<?= _("Types") ?>"
                 field="types"
                 :width="70"
                 :render="renderIconTypes"
                 cls="bbn-c"
                 default="[]"
    ></bbns-column>
    <bbns-column label=" "
                 cls="bbn-c"
                 :width="150"
                 :buttons="[{
                   text: '<?= _("Edit") ?>',
                   action: editType,
                   notext: true,
                   icon: 'nf nf-oct-pencil'
                 },{
                   text: '<?= _("Copy") ?>',
                   action: copyType,
                   notext: true,
                   icon: 'nf nf-fa-copy'
                 },{
                   text: '<?= _("Delete") ?>',
                   action: deleteType,
                   icon: 'nf nf-fa-trash',
                   notext: true
                 }]"
    ></bbns-column>
  </bbn-table>
</div>
