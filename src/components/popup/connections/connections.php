<!-- HTML Document -->

<bbn-table :source="source" :toolbar="getToolbarButtons">
  <bbns-column title=" "
               :component="$options.components.menu"
               :width="30"/>
  <bbns-column field="id"
               :hidden="true"/>
  <bbns-column field="text"/>
  <bbns-column field="type"/>
  <bbns-column field="host"/>
  <bbns-column field="path"/>
  <bbns-column field="user"/>
</bbn-table>