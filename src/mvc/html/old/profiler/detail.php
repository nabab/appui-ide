<!-- HTML Document -->
<bbn-table :source="source.data"
           :pageable="true"
           :filterable="true"
           :sortable="true">
  <bbns-column field="child"
               :title="_('Process')"/>
  <bbns-column field="parent"
               :title="_('Parent')"/>
  <bbns-column field="ct"
               :width="100"
               type="number"
               :title="'#' + _('Calls')"/>
  <bbns-column field="wt"
               :width="100"
               type="number"
               :title="_('Wall time')"/>
  <bbns-column field="mem_aa"
               :width="120"
               type="number"
               :title="_('Total memory')"/>
  <bbns-column field="cpu"
               :width="100"
               type="number"
               :title="_('CPU')"/>
  <bbns-column field="mu"
               :width="100"
               type="number"
               :title="_('MU')"/>
  <bbns-column field="mem_na"
               :width="100"
               type="number"
               :title="_('Mem NA')"/>
  <bbns-column field="mem_nf"
               :width="100"
               type="number"
               :title="_('Mem NF')"/>
  <bbns-column field="pmu"
               :width="100"
               type="number"
               :title="_('PMU')"/>
</bbn-table>