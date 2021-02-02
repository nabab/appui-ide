<!-- HTML Document -->
<bbn-table :source="source.data" :sortable="true" :filterable="true">
  <bbns-column field="last_date"
               type="datetime"
               :title="_('Last date')"
               :width="150">
  </bbns-column>
  <bbns-column field="first_date"
               type="datetime"
               :title="_('First date')"
               :width="150">
  </bbns-column>
  <bbns-column field="count"
               title="#"
               type="number"
               :ftitle="_('Number of times the error occurred')"
               :width="60">
  </bbns-column>
	<bbns-column field="line"
               type="number"
               :title="_('Line')"
               :width="60">
  </bbns-column>
	<bbns-column field="file"
               :title="_('File')">
  </bbns-column>
	<bbns-column field="error"
               :title="_('Error message')">
  </bbns-column>
  <bbns-column title="BT"
               :sortable="false"
               :width="50"
               :buttons="[{text: _('Backtrace'), Notext: true, icon: 'nf nf-mdi-history', action: backtrace}]">
  </bbns-column>
</bbn-table>