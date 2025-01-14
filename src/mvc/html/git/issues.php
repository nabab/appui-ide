<!-- HTML Document -->
<bbn-table :source="source.issues"
           :pageable="true"
           :page-size="50"
           :sortable="true"
           :filterable="true"
           :multifilter="true"
           :toolbar="[{
             text: _('Export CSV'),
             action: 'csv'
           }, {
             text: _('Export Excel'),
             action: exportExcel
           }]"
           ref="table"
>
  <bbns-column field="repository" 
               :label="_('Project')"
               :render="showRepo"
               :width="150"
  ></bbns-column>
  <bbns-column field="state"
               :label="_('State')"
               :render="showState"
               :cls="stateClass"
               :width="70"
  ></bbns-column>
  <bbns-column field="user.username"
               :label="_('Author')"
               :render="showUser"
               :width="100"
  ></bbns-column>
  <bbns-column field="created_at"
               :label="_('Created')"
               type="datetime"
               :width="120"
  ></bbns-column>
  <bbns-column field="closed_at"
               :label="_('Closed')"
               type="datetime"
               :width="120"
  ></bbns-column>
  <bbns-column field="title"
               :label="_('Title')"
               :render="showTitle"
  ></bbns-column>
  <bbns-column field="comments"
               :label="'# <i class=\'nf nf-fa-comments\'></i>'"
               :flabel="_('Number of comments')"
               type="number"
               :width="50"
               cls="bbn-c"
               :export="{
                 title: _('Number of comments')
               }"
  ></bbns-column>
</bbn-table>