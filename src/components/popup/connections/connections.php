<!-- HTML Document -->

<bbn-table :source="source"
           :toolbar="getToolbarButtons"
           :scrollable="true"
           button-mode="menu"
           editable="popup"
           editor="appui-ide-popup-connection"
           :pageable="true"
           :limit="20"
           :url="root + 'finder/actions'"
           ref="table">
  <bbns-column :buttons="menu"
               :width="30"
               :editable="false"/>
  <bbns-column field="id"
               :hidden="true"
               :editable="false"/>
  <bbns-column field="text"
               title="<?=_('Name')?>"
               width="20em"/>
  <bbns-column field="type"
               title="<?=_('Type')?>"
               :width="80"
               default="local"/>
  <bbns-column field="host"
               title="<?=_('Host')?>"
               width="15em"/>
  <bbns-column field="path"
               title="<?=_('Path')?>"/>
  <bbns-column field="user"
               title="<?=_('User')?>"
               width="15em"
               :editable="false"/>
</bbn-table>