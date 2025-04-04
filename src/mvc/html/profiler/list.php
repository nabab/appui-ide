<!-- HTML Document -->
<bbn-table :source="source.root + 'profiler/data'"
           :pageable="true"
           :filterable="true"
           :order="[{field: 'time', dir: 'desc'}]"
           @dataloaded="updateURLs"
           ref="table"
           :sortable="true">
  <bbns-column field="id_user"
               :source="users"
               :label="_('User')"/>
  <bbns-column field="url"
               :source="source.urls"
               :label="_('URL')"/>
  <bbns-column field="time"
               :width="200"
               :label="_('Time')"
               type="datetime"/>
  <bbns-column field="length"
               :width="100"
               :label="_('Length')"
               type="number"
               :precision="6"/>
  <bbns-column :width="60"
               label=" "
               :buttons="[{
                         text: _('Detail'),
                         notext: true,
                         action: detail,
                         icon: 'nf nf-fa-eye'
                         }]"/>
</bbn-table>