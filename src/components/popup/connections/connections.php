<!-- HTML Document -->

<bbn-table :source="source"
           :toolbar="getToolbarButtons"
           :scrollable="false"
           button-mode="menu"
           editable="popup"
           :pageable="true"
           :limit="20"
           :url="root + 'finder/actions'">
  <bbns-column label=" "
               :buttons="menu"
               :width="30"/>
  <bbns-column field="id"
               :hidden="true"/>
  <bbns-column field="text"
               width="20em"/>
  <bbns-column field="type"
               :width="80"/>
  <bbns-column field="host"
               width="15em"/>
  <bbns-column field="path"/>
  <bbns-column field="user"
               width="15em"/>
</bbn-table>