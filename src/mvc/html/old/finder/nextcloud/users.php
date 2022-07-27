<div class="bbn-100">
  <bbn-table :pageable="true"
             :info="true"
             :sortable="true"
             :filterable="true"
             editable="inline"
             :source="users"
  >
    <bbns-column field="userId" title="<?=_('User id')?>"></bbns-column>
    <bbns-column field="userName" title="<?=_('User')?>"></bbns-column>
    <bbns-column field="email" title="<?=_('Email')?>"></bbns-column>
    <bbns-column field="quota" title="<?=_('Quota')?>"></bbns-column>
    <bbns-column field="groups" title="<?=_('Groups')?>"></bbns-column>
  </bbn-table>
</div>