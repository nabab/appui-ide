<!-- HTML Document -->

<bbn-table :source="source"
           :toolbar="getToolbarButtons"
           :scrollable="false"
           button-mode="menu"
           editable="popup"
           editor="appui-ide-popup-connection"
           :pageable="true"
           :limit="20"
           :url="root + 'finder/actions'"
           ref="table">
  <bbns-column :buttons="menu"
               :width="30"/>
  <bbns-column field="id"
               :invisible="true"
               type="uid"/>
  <bbns-column field="text"
               min-width="20rem"
               label="<?=_("Name")?>"/>
  <bbns-column field="type"
               :width="70"
               label="<?=_("Type")?>"/>
  <bbns-column field="host"
               min-width="15em"
               label="<?=_("Host")?>"/>
  <bbns-column field="path"
               min-width="20rem"
               label="<?=_("Path")?>"/>
  <bbns-column field="user"
               min-width="15em"
               label="<?=_("User")?>"/>
</bbn-table>