<!-- HTML Document -->
<bbn-table :source="source.data" :sortable="true" :filterable="true">
  <bbns-column field="last_date"
               type="datetime"
               :label="_('Last date')"
               :width="150"/>
  <bbns-column field="first_date"
               type="datetime"
               :label="_('First date')"
               :width="150"/>
  <bbns-column field="count"
               label="#"
               type="number"
               :flabel="_('Number of times the error occurred')"
               :width="60"/>
	<bbns-column field="line"
               type="number"
               :label="_('Line')"
               :width="60"/>
	<bbns-column field="file"
               :label="_('File')"/>
	<bbns-column field="error"
               :label="_('Error message')"/>
  <bbns-column label="BT"
               :sortable="false"
               :width="50"
               :buttons="[{label: _('Backtrace'), notext: true, icon: 'nf nf-md-history', action: backtrace}]"/>
</bbn-table>
