<!-- HTML Document -->

<bbn-table :source="source"
           :toolbar="getToolbarButtons"
           :scrollable="false"
           button-mode="menu"
           editable="popup"
           :pageable="true"
           :limit="20"
           :url="root + 'finder/actions'">
  <bbns-column :buttons="menu"
               :width="30"/>
  <bbns-column field="id"
               :invisible="true"/>
  <bbns-column field="text"
               width="20em"
               label="<?=_("Name")?>"/>
  <bbns-column field="type"
               :width="70"
               label="<?=_("Type")?>"/>
  <bbns-column field="host"
               width="15em"
               label="<?=_("Host")?>"/>
  <bbns-column field="path"
               :width="400"
               label="<?=_("Path")?>"/>
  <bbns-column field="user"
               width="15em"
               label="<?=_("User")?>"/>
</bbn-table>